import React, { useContext, useState } from "react";
import { getDay } from "../../../utils/DateFormatter";
import { UserContext } from "../../../App";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import BlogContent from "../BlogContent";
import { BlogContext } from "../../../pages/BlogDisplayPage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {
    const {
        commented_by: {
            personal_info: { profile_img, fullname, username },
        },
        commentedAt,
        comment,
        _id,
        children,
    } = commentData;

    let {
        blog,
        blog: {
            comments,
            comments: { results: commentsArr },
        },
        setBlog,
    } = useContext(BlogContext);

    const {
        userAuth: { access_token },
    } = useContext(UserContext);
    const [isReplying, setIsReplying] = useState(false);

    const removeCommentsCards = (startingPoint) => {
        if (commentsArr[startingPoint]) {
            while (
                commentsArr[startingPoint].childrenLevel >
                commentData.childrenLevel
            ) {
                commentsArr.splice(startingPoint, 1);

                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        setBlog({ ...blog, comments: { results: commentsArr } });
    };

    const loadReplies = ({ skip = 0 }) => {
        if (children.length) {
            hideReplies();

            axios
                .post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/blogs/get-replies",
                    { _id, skip }
                )
                .then(({ data: { replies } }) => {
                    commentData.isReplyLoaded = true;

                    for (let i = 0; i < replies.length; i++) {
                        replies[i].childrenLevel = commentData.childrenLevel + 1;

                        // update the comments array
                        commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                    }

                    setBlog({
                        ...blog,
                        comments: { ...comments, results: commentsArr },
                    });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Failed to load replies");
                });
        }
    };

    const hideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentsCards(index + 1);
    };

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Please login first");
        }

        setIsReplying(!isReplying);
    };

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                {/* user details */}
                <div className="flex gap-3 items-center mb-8">
                    <img
                        src={profile_img}
                        alt="profile image"
                        className="w-6 h-6 rounded-full"
                    />

                    <p className="line-clamp-1">
                        {fullname} @{username}
                    </p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>

                {/* comment */}
                <p className="font-gelasio text-xl ml-3">{comment}</p>

                {/* reply section */}
                <div className="flex gap-5 items-center my-5">
                    {commentData.isReplyLoaded ? (
                        <button
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center"
                            onClick={hideReplies}
                        >
                            <i className="fi fi-rs-comment-dots mr-1"></i>
                            Hide Reply
                        </button>
                    ) : (
                        <button
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center"
                            onClick={loadReplies}
                        >
                            <i className="fi fi-rs-comment-dots mr-1"></i>
                            {children.length}{" "} 
                            Reply
                        </button>
                    )}

                    <button className=" underline" onClick={handleReplyClick}>
                        Reply
                    </button>
                </div>

                {/* reply text area */}
                {isReplying ? (
                    <div>
                        <CommentField
                            action={"reply"}
                            index={index}
                            replyingTo={_id}
                            setReplying={setIsReplying}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default CommentCard;
