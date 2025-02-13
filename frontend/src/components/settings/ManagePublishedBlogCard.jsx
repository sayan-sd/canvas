import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getDay } from "../../utils/DateFormatter";
import { UserContext } from "../../App";
import axios from "axios";
import toast from "react-hot-toast";


const BlogStats = ({ stats }) => {
    const iconMap = {
        likes: "fi fi-rr-heart",
        comments: "fi fi-rr-comment",
        reads: "fi fi-rr-eye",
    };

    return (
        <div className="flex justify-around items-center bg-grey border border-dark-grey/20 rounded-md p-4">
            {Object.keys(stats).map((key, i) => {
                // skip keys that include "parent"
                if (key.includes("parent")) return null;
                const label = key.split("_")[1];
                return (
                    <div key={i} className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                            <i
                                className={`${iconMap[label]} text-base mt-1 max-sm:hidden`}
                            ></i>
                            <span className="text-xl font-semibold">
                                {stats[key].toLocaleString()}
                            </span>
                        </div>
                        <span className="text-sm text-dark-grey capitalize">
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// published blog section
export const ManagePublishedBlogCard = ({ blog }) => {
    const { banner, blog_id, title, publishedAt, activity } = blog;
    const [showStat, setShowStat] = useState(false);
    const { userAuth } = useContext(UserContext);
    const access_token = userAuth ? userAuth.access_token : "";

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden my-6">
            <div className="md:flex">
                {/* Blog Banner */}
                <div className="md:flex-shrink-0">
                    <img
                        src={banner}
                        alt="Blog Banner"
                        className="w-full h-48 object-cover md:w-48 md:h-full"
                    />
                </div>
                {/* Blog Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                        <Link
                            to={`/blog/${blog_id}`}
                            className="block text-2xl font-bold hover:underline mb-2"
                        >
                            {title}
                        </Link>
                        <p className="text-sm text-dark-grey">
                            Published on {getDay(publishedAt)}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-6">
                            <Link
                                to={`/editor/${blog_id}`}
                                className="underline"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={(e) =>
                                    deleteBlog(blog, access_token, e.target)
                                }
                                className="text-red underline"
                            >
                                Delete
                            </button>
                        </div>
                        {/* Stats toggle for small screens */}
                        <button
                            onClick={() => setShowStat(!showStat)}
                            className="text-blue-600 hover:underline md:hidden"
                        >
                            Stats
                        </button>
                    </div>
                </div>
            </div>
            {/* Stats section for small screens */}
            {showStat && (
                <div className="md:hidden p-4 border-t">
                    <BlogStats stats={activity} />
                </div>
            )}
            {/* Always visible stats for medium and larger screens */}
            <div className="hidden md:block p-4 border-t">
                <BlogStats stats={activity} />
            </div>
        </div>
    );
};

// draft blog section
export const ManageDraftBlogCard = ({ blog }) => {
    let { title, des, blog_id, index } = blog;
    index++;

    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    return (
        <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey rounded-lg shadow-md">
            <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
                {index < 10 ? "0" + index : index}
            </h1>

            <div>
                <h1 className="blog-title mb-3">{title}</h1>
                <p className="line-clamp-2 font-gelasio text-dark-grey">
                    {des.length ? des : "No description"}
                </p>

                <div className="flex gap-6 mt-3">
                    <Link
                        to={`/editor/${blog_id}`}
                        className="pr-4 py-2 underline"
                    >
                        Edit
                    </Link>
                    <button
                        className="pr-4 py-2 underline text-red"
                        onClick={(e) =>
                            deleteBlog(blog, access_token, e.target)
                        }
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// delete blog
const deleteBlog = (blog, access_token, target) => {
    const { index, blog_id, setStateFn } = blog;
    target.setAttribute("disabled", true);

    axios
        .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/users/delete-blog",
            { blog_id },
            { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then(({ data }) => {
            target.removeAttribute("disabled");
            setStateFn((prevState) => {
                if (!prevState) return null;
                const { deletedDocCount = 0, totalDocs, results } = prevState;
                const updatedResults = [...results];
                updatedResults.splice(index, 1);

                // no docs
                if (!updatedResults.length && totalDocs - 1 > 0) {
                    return null;
                }
                return {
                    ...prevState,
                    results: updatedResults,
                    totalDocs: totalDocs - 1,
                    deletedDocCount: deletedDocCount + 1,
                };
            });
            toast.success("Blog deleted successfully!");
        })
        .catch((err) => {
            target.removeAttribute("disabled");
            toast.error("Server error: " + err);
            console.error(err);
        });
};

export default { ManagePublishedBlogCard, ManageDraftBlogCard };
