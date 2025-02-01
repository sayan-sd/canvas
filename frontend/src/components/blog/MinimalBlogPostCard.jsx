import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDay } from "../../utils/DateFormatter";

const MinimalBlogPostCard = ({ blog, index }) => {
    const {
        title,
        blog_id: id,
        author: {
            personal_info: { fullname, username, profile_img },
        },
        publishedAt,
    } = blog;
    const navigate = useNavigate();

    return (
        <Link to={`/blog/${id}`} className={`flex gap-5 ${index == 4 ? "mb-4" : "mb-8"}`}>
            <div>
                {/* username + published at */}
                <div className="flex gap-2 items-center mb-3">
                    <img
                        src={profile_img}
                        alt="User Profile Image"
                        className="w-6 h-6 rounded-full"
                    />
                    <button
                        className="line-clamp-1 font-medium hover:underline"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/user/${username}`);
                        }}
                    >
                        {fullname}
                    </button>
                    <p className="min-w-fit"> • {getDay(publishedAt)}</p>
                </div>

                {/* blog title */}
                <h1 className="blog-title lg:text-xl font-medium">{title}</h1>
            </div>
        </Link>
    );
};

export default MinimalBlogPostCard;
