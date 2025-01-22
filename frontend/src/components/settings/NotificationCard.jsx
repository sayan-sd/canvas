import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getDay } from "../../utils/DateFormatter";
import NotificationCommentField from "./NotificationCommentField";
import { UserContext } from "../../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {
    const [isReplying, setIsReplying] = useState(false);

    const {
        seen,
        type,
        reply,
        comment,
        replied_on_comment,
        user,
        user: {
            personal_info: { profile_img, username, fullname },
        },
        blog: { _id, blog_id, title },
        createdAt,
        _id: notification_id,
    } = data;

    const { userAuth } = useContext(UserContext);
    let author_username, author_profile_img, access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
        author_username = userAuth.username;
        author_profile_img = userAuth.profile_img;
    }

    let {
        notifications,
        notifications: { results, totalDocs, deletedDocCount },
        setNotifications,
    } = notificationState;

    const handleReplyClick = () => {
        setIsReplying(!isReplying);
    };

    const handleDelete = (comment_id, type, target) => {
        target.setAttribute("disabled", true);

        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/blogs/delete-comment",
                { _id: comment_id },
                { headers: { Authorization: "Bearer " + access_token } }
            )
            .then(() => {
                if (type == "comment") {
                    results.splice(index, 1);
                } else {
                    delete results[index].reply;
                }
                target.removeAttribute("disabled");
                setNotifications({
                    ...notifications,
                    results,
                    totalDocs: totalDocs - 1,
                    deletedDocCount: notifications.deletedDocCount + 1,
                });
            })
            .catch((err) => {
                console.log(err);
                target.removeAttribute("disabled");
            });
    };

    return (
        <div
            className={
                "p-6 border-b border-grey border-l-black " +
                (!seen ? "border-l-2" : "")
            }
        >
            <div className="flex gap-5 mb-3">
                <img
                    src={profile_img}
                    alt="Profile Image"
                    className="w-14 h-14 flex-none rounded-full"
                />
                <div className="w-full">
                    <h1 className="font-medium text-xl text-dark-grey">
                        <span className="lg:inline-block hidden capitalize">
                            {fullname}
                        </span>
                        <Link
                            to={`/user/${username}`}
                            className="mx-1 text-black underline"
                        >
                            @{username}
                        </Link>
                        {/* type of the notification */}
                        <span className="font-normal">
                            {type == "like"
                                ? "liked your blog"
                                : type == "comment"
                                ? "commented on"
                                : "replied on"}
                        </span>
                    </h1>

                    {type == "reply" ? (
                        <div>
                            <p className="p-4 mt-4 rounded-md bg-grey">
                                {replied_on_comment.comment}
                            </p>
                        </div>
                    ) : (
                        <Link
                            to={`/blog/${blog_id}`}
                            className="font-medium text-dark-grey hover:underline line-clamp-1"
                        >{`"${title}"`}</Link>
                    )}
                </div>
            </div>

            {type != "like" ? (
                <p className="ml-14 pl-5 font-gelasio text-xl my-5">
                    {comment.comment}
                </p>
            ) : (
                ""
            )}

            <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                <p>{getDay(createdAt)}</p>
                {type != "like" ? (
                    <>
                        {!reply ? (
                            <button
                                className="underline hover:text-black"
                                onClick={handleReplyClick}
                            >
                                Reply
                            </button>
                        ) : (
                            ""
                        )}
                        <button
                            className="underline hover:text-black"
                            onClick={(e) =>
                                handleDelete(comment._id, "comment", e.target)
                            }
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    ""
                )}
            </div>

            {isReplying ? (
                <div className="mt-8">
                    <NotificationCommentField
                        _id={_id}
                        blog_author={user}
                        index={index}
                        replyingTo={comment._id}
                        setReplying={setIsReplying}
                        notification_id={notification_id}
                        notificationData={notificationState}
                    />
                </div>
            ) : (
                ""
            )}

            {reply ? (
                <div className="ml-20 bg-grey p-5 mt-5 rounded-md">
                    <div className="flex gap-3 mb-3">
                        <img
                            src={author_profile_img}
                            alt="Author profile image"
                            className="w-8 h-8 rounded-full"
                        />

                        <div>
                            <h1 className="font-medium text-xl text-dark-grey">
                                <Link
                                    to={`/user/${author_username}`}
                                    className="mx-1 text-black underline"
                                >
                                    @{author_username}
                                </Link>

                                <span className="font-normal">replied to</span>

                                <Link
                                    to={`/user/${username}`}
                                    className="mx-1 text-black underline"
                                >
                                    @{username}
                                </Link>
                            </h1>
                        </div>
                    </div>

                    <p className="ml-14 font-gelasio text-xl my-2">
                        {reply.comment}
                    </p>

                    <button
                        className="underline hover:text-black ml-14 mt-2"
                        onClick={(e) =>
                            handleDelete(comment._id, "reply", e.target)
                        }
                    >
                        Delete
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default NotificationCard;
