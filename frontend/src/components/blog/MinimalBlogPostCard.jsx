import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "./helper/DateFormatter";

const MinimalBlogPostCard = ({ blog, index }) => {
    const {
        title,
        blog_id: id,
        author: {
            personal_info: { fullname, username, profile_img },
        },
        publishedAt,
    } = blog;

    return (
        <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
            {/* numeric index */}
            <h1 className="blog-index">
                {index < 10 ? "0" + (index + 1) : index + 1}
            </h1>

            <div>
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

                {/* blog title */}
                <h1 className="blog-title">{ title }</h1>
            </div>
        </Link>
    );
};

export default MinimalBlogPostCard;