import React, { useContext, useEffect, useState } from "react";
import { getDay } from "../../utils/DateFormatter";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { handleBookmark } from "./helper/handleBookmark";

const BlogPostCard = ({ content, author }) => {
    const {
        publishedAt,
        tags,
        title,
        des,
        banner,
        activity: { total_likes, total_comments },
        blog_id: id,
    } = content;
    const { fullname, username, profile_img } = author;
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    const { userAuth, setUserAuth } = useContext(UserContext);

    useEffect(() => {
        if (userAuth?.bookmarkIds) {
            setIsBookmarked(userAuth.bookmarkIds.includes(id));
        }
    }, [userAuth?.bookmarkIds, id]);

    useEffect(() => {
        if (userAuth != null) {
            setAccessToken(userAuth.access_token);
        }
    }, [userAuth]);

    return (
        <Link
            to={`/blog/${id}`}
            className="block rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-6"
        >
            {/* Blog Card Container */}
            <div className="flex flex-row max-sm:flex-col md:max-[1100px]:flex-col">
                {/* Blog Banner */}
                <div className="w-1/3 max-sm:w-full md:max-[1100px]:w-full">
                    <div className="relative h-full max-sm:h-48 md:max-[1100px]:h-48">
                        <img
                            src={banner}
                            alt="Blog Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                            <span
                                className="bg-yellow px-3 py-1 rounded-full text-sm font-medium cursor-pointer text-[#000] hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/tag/${tags[0].replace(" ", "-")}`);
                                }}
                            >
                                {tags[0]}
                            </span>
                        </div>
                    </div>
                </div>
    
                {/* Blog Content */}
                <div className="w-2/3 max-sm:w-full md:max-[1100px]:w-full p-4 sm:py-4 sm:px-6">
                    {/* Author Info & Date */}
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src={profile_img}
                            alt="User Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/user/${username}`);
                            }}
                        />
                        <div className="flex-1">
                            <p className="text-sm">
                                By{" "}
                                <span
                                    className="font-medium hover:underline cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/user/${username}`);
                                    }}
                                >
                                    {fullname}
                                </span>
                            </p>
                            <p className="text-sm text-dark-grey">
                                {getDay(publishedAt)}
                            </p>
                        </div>
                    </div>
    
                    {/* Title */}
                    <h1 className="blog-title">{title}</h1>
    
                    {/* Description */}
                    <p className="text-dark-grey mb-3 line-clamp-2">{des}</p>
    
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-dark-grey">
                        <div className="flex items-center gap-5">
                            <span className="flex items-center gap-2">
                                <i className="fi fi-sr-heart text-xl"></i>
                                {total_likes}
                            </span>
                            <span className="flex items-center gap-2">
                                <i className="fi fi-sr-comment-dots text-xl"></i>
                                {total_comments}
                            </span>
                        </div>
    
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleBookmark(
                                    accessToken,
                                    id,
                                    isBookmarked,
                                    setIsBookmarked,
                                    userAuth,
                                    setUserAuth
                                );
                            }}
                            className="transition-colors"
                        >
                            <i
                                className={`fi fi-${
                                    isBookmarked ? "sr" : "rr"
                                }-bookmark text-xl`}
                            ></i>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
    
};

export default BlogPostCard;
