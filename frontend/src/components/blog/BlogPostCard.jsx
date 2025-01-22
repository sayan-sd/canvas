import React from "react";
import { getDay } from "../../utils/DateFormatter";
import { Link } from "react-router-dom";

const BlogPostCard = ({ content, author }) => {
    const {
        publishedAt,
        tags,
        title,
        des,
        banner,
        activity: { total_likes },
        blog_id: id,
    } = content;
    const { fullname, username, profile_img } = author;

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
                        {fullname} @{username}
                    </p>
                    <p className="min-w-fit">{getDay(publishedAt)}</p>
                </div>

                {/* title */}
                <h1 className="blog-title">{title}</h1>

                {/* blog description */}
                <p className="my-3 text-xl font-gelasio left-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
                    {des}
                </p>

                {/* tag & like count */}
                <div className="flex gap-4 mt-7">
                    <span className="btn-light py-1 px-4">{tags[0]}</span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-sr-heart text-xl"></i>
                        {total_likes}
                    </span>
                </div>
            </div>

            {/* blog banner */}
            <div className="h-28 aspect-square bg-grey">
                <img
                    src={banner}
                    alt="Blog Banner"
                    className="w-full h-full aspect-square object-cover"
                />
            </div>
        </Link>
    );
};

export default BlogPostCard;
