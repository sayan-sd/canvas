import React, { useContext, useState } from "react";
import { UserContext } from "../../../App";
import toast from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../../../pages/BlogDisplayPage";

const CommentField = ({ action, index = undefined, replyingTo = undefined, setReplying }) => {
    const [comment, setComment] = useState("");

    const {
        userAuth: { access_token, username, fullname, profile_img },
    } = useContext(UserContext);
    let {
        blog,
        blog: {
            _id,
            author: { _id: blog_author },
            comments,
            comments: {results: commentsArr},
            activity,
            activity: { total_comments, totoal_parent_comments },
        },
        setBlog,
        setTotalParentCommentsLoaded,
    } = useContext(BlogContext);

    const handleComment = () => {
        // validate data
        if (!access_token) {
            return toast.error("Please login first");
        }
        if (!comment.length) {
            return toast.error("Please enter a comment");
        }

        // db request
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/blogs/add-comment",
                {
                    _id,
                    blog_author,
                    comment,
                    replying_to: replyingTo,
                },
                { headers: { Authorization: "Bearer " + access_token } }
            )
            .then(({ data }) => {
                setComment("");

                // add user details
                data.commented_by = {
                    personal_info: { username, profile_img, fullname },
                };

                // add new comment with the old comment array
                let newCommentArr;

                // check if reply
                if (replyingTo) {
                    commentsArr[index].children.push(data._id);
                    data.childrenLevel = commentsArr[index].childrenLevel + 1;
                    data.parentIndex = index;

                    // update the comment array
                    commentsArr[index].isReplyLoaded = true;
                    commentsArr.splice(index + 1, 0, data);
                    newCommentArr = commentsArr;

                    // hide text area
                    setReplying(false);
                }
                else {
                    data.childrenLevel = 0; // parent
                    newCommentArr = [data, ...commentsArr];
                }

                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                setBlog({
                    ...blog,
                    comments: { ...comments, results: newCommentArr },
                    activity: {
                        ...activity,
                        total_comments: total_comments + 1,
                        totoal_parent_comments:
                            totoal_parent_comments + parentCommentIncrementVal,
                    },
                });

                // updata how many comments loaded
                setTotalParentCommentsLoaded(prev => prev + parentCommentIncrementVal)
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to add comment.");
            });
    };

    return (
        <>
            <textarea
                value={comment}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
                onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                {action}
            </button>
        </>
    );
};

export default CommentField;
