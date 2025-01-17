import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import toast from "react-hot-toast";
import axios from "axios";

const NotificationCommentField = ({
    _id,
    blog_author,
    index = undefined,
    replyingTo = undefined,
    setReplying,
    notification_id,
    notificationData,
}) => {
    const [comment, setComment] = useState("");

    let { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }
    const { _id: user_id } = blog_author;
    const { notifications, notifications: { results }, setNotifications } = notificationData;


    const handleComment = () => {
        // validate data
        if (!comment.length) {
            return toast.error("Please enter a comment");
        }

        // db request
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/blogs/add-comment",
                {
                    _id,
                    blog_author: user_id,
                    comment,
                    replying_to: replyingTo,
                    notification_id,
                },
                { headers: { Authorization: "Bearer " + access_token } }
            )
            .then(({ data }) => {
                setReplying(false);

                results[index].reply = { comment, _id: data._id };
                setNotifications({...notifications, results });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to reply.");
            });
    };

    return (
        <>
            <textarea
                value={comment}
                placeholder="Leave a reply..."
                className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
                onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>
                Reply
            </button>
        </>
    );
};

export default NotificationCommentField;
