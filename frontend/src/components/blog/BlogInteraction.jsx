import React, { useContext, useEffect } from "react";
import { BlogContext } from "../../pages/BlogDisplayPage";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
    let { blog, setBlog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper } =
        useContext(BlogContext);
    let blog_id,
        _id,
        title,
        total_likes,
        total_comments,
        author_username,
        activity;
    if (blog != null) {
        blog_id = blog.blog_id;
        _id = blog._id;
        title = blog.title;
        activity = blog.activity;
        total_likes = blog.activity.total_likes;
        total_comments = blog.activity.total_comments;
        author_username = blog.author.personal_info.username;
    }

    // user context
    const { userAuth } = useContext(UserContext);
    let username, access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
        username = userAuth.username;
    }

    useEffect(() => {
        // check if user has liked the blog
        if (access_token) {
            axios
                .post(
                    import.meta.env.VITE_SERVER_DOMAIN +
                        "/blogs/isliked-by-user",
                    { _id },
                    { headers: { Authorization: "Bearer " + access_token } }
                )
                .then(({ data }) => {
                    setIsLikedByUser(data.liked_by_user);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const handleLike = () => {
        if (access_token) {
            setIsLikedByUser(!isLikedByUser);

            !isLikedByUser ? total_likes++ : total_likes--;
            setBlog({ ...blog, activity: { ...activity, total_likes } });

            // like blog db call
            axios
                .post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/blogs/like-blog",
                    { _id, isLikedByUser },
                    { headers: { Authorization: "Bearer " + access_token } }
                )
                .then(({ data }) => {
                    // console.log(data);
                })
                .catch((err) => {
                    toast.error("Failed to update like status");
                    console.log(err);
                });
        }
        // not logged in
        else {
            toast.error("Please login first");
        }
    };

    return (
        <>
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    {/* like */}
                    <button
                        className={
                            "w-10 h-10 rounded-full flex items-center justify-center " +
                            (isLikedByUser
                                ? "bg-red/20 text-red"
                                : "bg-grey/80")
                        }
                        onClick={handleLike}
                    >
                        <i
                            className={`fi fi-${
                                isLikedByUser ? "sr" : "rr"
                            }-heart flex items-center justify-center`}
                        />
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    {/* comment */}
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={() => setCommentsWrapper(!commentsWrapper)}>
                        <i className="fi fi-rr-comment-dots flex items-center justify-center" />
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">
                    {/* Edit button - author only */}
                    {username == author_username ? (
                        <Link
                            to={`/editor/${blog_id}`}
                            className=" underline hover:text-purple"
                        >
                            Edit
                        </Link>
                    ) : (
                        ""
                    )}

                    {/* share - (x) */}
                    <Link
                        to={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                        target="_blank"
                    >
                        <i className="fi fi-brands-twitter-alt text-xl text-dark-grey hover:text-black"></i>
                    </Link>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;
