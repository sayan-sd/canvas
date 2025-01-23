import React, { useContext, useEffect, useState, useRef } from "react";
import { BlogContext } from "../../pages/BlogDisplayPage";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
    let { blog, setBlog, isLikedByUser, setIsLikedByUser, commentsWrapper, setCommentsWrapper } =
        useContext(BlogContext);
    let blog_id, _id, title, total_likes, total_comments, author_username, activity;
    
    const [showSharePopup, setShowSharePopup] = useState(false);
    const shareButtonRef = useRef(null);
    const sharePopupRef = useRef(null);

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
        const handleClickOutside = (event) => {
            if (
                sharePopupRef.current &&
                !sharePopupRef.current.contains(event.target) &&
                shareButtonRef.current &&
                !shareButtonRef.current.contains(event.target)
            ) {
                setShowSharePopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleShareClick = () => {
        setShowSharePopup(!showSharePopup);
    };

    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                toast.success("Link copied to clipboard");
                setShowSharePopup(false);
            })
            .catch(err => {
                toast.error("Failed to copy link");
                console.error(err);
            });
    };

    const shareOnX = () => {
        window.open(
            `https://x.com/intent/tweet?text=Read ${title}&url=${window.location.href}`,
            '_blank'
        );
        setShowSharePopup(false);
    };

    const shareOnLinkedIn = () => {
        window.open(
            // `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
            `https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=${encodeURIComponent(window.location.href)}`,
            '_blank'
        );
        setShowSharePopup(false);
    };

    return (
        <>
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between relative">
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

                    {/* share button */}
                    <div className="relative">
                        <button 
                            ref={shareButtonRef}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                            onClick={handleShareClick}
                        >
                            <i className="fi fi-rr-share text-xl flex items-center justify-center"></i>
                        </button>
                        
                        {showSharePopup && (
                            <div 
                                ref={sharePopupRef}
                                className="absolute right-0 top-full mt-2 w-52 bg-white border-2 border-grey rounded-lg shadow-lg z-10"
                            >
                                <ul>
                                    <li 
                                        className="px-4 py-2 hover:bg-grey cursor-pointer border-b border-grey flex items-center gap-3"
                                        onClick={copyLinkToClipboard}
                                    >
                                        <i className="fi fi-rr-link-alt"></i>
                                        Copy Link
                                    </li>
                                    <li 
                                        className="px-4 py-2 hover:bg-grey cursor-pointer flex items-center gap-3"
                                        onClick={shareOnX}
                                    >
                                        <i className="fi fi-brands-twitter-alt-square mt-1"></i>
                                        Share on X
                                    </li>
                                    <li 
                                        className="px-4 py-2 hover:bg-grey cursor-pointer flex items-center gap-3"
                                        onClick={shareOnLinkedIn}
                                    >
                                        <i className="fi fi-brands-linkedin mt-1"></i>
                                        Share on LinkedIn
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;