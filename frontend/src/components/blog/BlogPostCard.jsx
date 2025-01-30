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
    const isTagPage = location.pathname.startsWith("/tag/");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    const { userAuth, setUserAuth } = useContext(UserContext);
    let access_token;

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
            className="flex gap-8 items-center border-b border-grey pb-5 mb-4"
        >
            {/* blog content */}
            <div className="w-full">
                {/* username + published at */}
                <div className="flex gap-2 items-center mb-7">
                    <img
                        src={profile_img}
                        alt="User Profile Image"
                        className="w-6 h-6 rounded-full"
                    />
                    <p className="line-clamp-1">
                        In{" "}
                        <span
                            className="capitalize hover:underline font-medium"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/tag/${tags[0]}`);
                            }}
                        >
                            {tags[0]}
                        </span>{" "}
                        by{" "}
                        <span
                            className="hover:underline font-medium"
                            to={`/user/${username}`}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/user/${username}`);
                            }}
                        >
                            {fullname}
                        </span>
                    </p>
                    <p className="min-w-fit hidden sm:inline-block">
                        {getDay(publishedAt)}
                    </p>
                </div>

                {/* title */}
                <h1 className="blog-title">{title}</h1>

                {/* blog description */}
                <p
                    className={`my-3 text-xl font-gelasio max-sm:hidden left-7 line-clamp-2 ${
                        isTagPage ? "" : "md:max-[1100px]:hidden"
                    }`}
                >
                    {des}
                </p>

                {/* tag & like count */}
                <div className="flex items-center justify-between mt-7 font-medium">
                    <div className="flex gap-4">
                        <span className="ml-3 flex items-center gap-2 text-dark-grey">
                            <i className="fi fi-sr-heart text-xl"></i>
                            {total_likes}
                        </span>
                        <span className="ml-3 flex items-center gap-2 text-dark-grey">
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
                    >
                        <i
                            className={`fi fi-${
                                isBookmarked ? "sr" : "rr"
                            }-bookmark md:mr-8 text-xl`}
                        ></i>
                    </button>
                </div>
            </div>

            {/* blog banner */}
            <div
                className="h-28 
            aspect-video bg-grey max-sm:aspect-square md:max-[1100px]:aspect-square"
            >
                <img
                    src={banner}
                    alt="Blog Banner"
                    className="w-full h-full object-cover aspect-video max-sm:aspect-square md:max-[1100px]:aspect-square"
                />
            </div>
        </Link>
    );
};

export default BlogPostCard;
