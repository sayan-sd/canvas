import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getDay } from "../../utils/DateFormatter";
import { UserContext } from "../../App";
import axios from "axios";
import toast from "react-hot-toast";

const BlogStats = ({ stats }) => {
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {Object.keys(stats).map((key, i) => {
                return !key.includes("parent") ? (
                    <div
                        className={
                            "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
                            (i != 0 ? "border-grey border-l" : "")
                        }
                        key={i}
                    >
                        <h1 className="text-xl lg:text-2xl mb-2">
                            {stats[key].toLocaleString()}
                        </h1>
                        <p className="max-lg:text-dark-grey capitalize">
                            {key.split("_")[1]}
                        </p>
                    </div>
                ) : (
                    ""
                );
            })}
        </div>
    );
};

export const ManagePublishedBlogCard = ({ blog }) => {
    const { banner, blog_id, title, publishedAt, activity } = blog;

    const [showStat, setShowStat] = useState(false);

    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <img
                    src={banner}
                    alt="Blog Banner"
                    className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover"
                />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link
                            to={`/blog/${blog_id}`}
                            className="blog-title mb-4 hover:underline"
                        >
                            {title}
                        </Link>

                        <p className="line-clamp-1">
                            Published on {getDay(publishedAt)}
                        </p>
                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link
                            to={`/editor/${blog_id}`}
                            className="py-4 pr-4 underline"
                        >
                            Edit
                        </Link>

                        <button
                            className="lg:hidden pr-4 py-2 underline"
                            onClick={() => setShowStat(!showStat)}
                        >
                            Stats
                        </button>

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

                {/* stats section - small screen */}
                <div className="max-lg:hidden">
                    <BlogStats stats={activity} />
                </div>
            </div>

            {/* stats section - large screen */}
            {showStat ? (
                <div className="lg:hidden">
                    <BlogStats stats={activity} />
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export const ManageDraftBlogCard = ({ blog }) => {
    let { title, des, blog_id, index } = blog;
    index++;

    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    return (
        <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
            <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
                {index < 10 ? "0" + index : index}
            </h1>

            <div>
                <h1 className="blog-title mb-3">{title}</h1>
                <p className="line-clamp-2 font-gelasio">
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

const deleteBlog = (blog, access_token, target) => {
    let { index, blog_id, setStateFn } = blog;

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

                // console.log(prevState);

                const { deletedDocCount = 0, totalDocs, results } = prevState;

                // Create a new array without the deleted blog
                const updatedResults = [...results];
                updatedResults.splice(index, 1);

                // If no more results and we had blogs before, return null to trigger a refresh
                if (!updatedResults.length && totalDocs - 1 > 0) {
                    return null;
                }

                // Return updated state
                return {
                    ...prevState,
                    results: updatedResults,
                    totalDocs: totalDocs - 1,
                    deletedDocCount: deletedDocCount + 1,
                };
            });
        })
        .catch((err) => {
            target.removeAttribute("disabled");
            toast.error('Server error: ' + err);
            console.error(err);
        });
};
