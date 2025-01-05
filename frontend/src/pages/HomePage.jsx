import React, { useEffect, useState } from "react";
import PageAnimationWrapper from "../components/common/PageAnimation";
import InpageNavigation, {
    activeTabRef,
} from "../components/home/InpageNavigation";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import BlogPostCard from "../components/blog/BlogPostCard";
import MinimalBlogPostCard from "../components/blog/MinimalBlogPostCard";
import NoDataMessage from "../components/common/NoDataMessage";

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState("home");

    const categories = [
        "technology",
        "lifestyle",
        "ai",
        "entertainment",
        "health",
        "travel",
        "adventure",
        "hollywood",
    ];

    // latest blogs
    const fetchLatestBlogs = async () => {
        axios
            .get(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/latest-blogs")
            .then(({ data }) => {
                setBlogs(data.blogs);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // trending blogs
    const fetchTrendingBlogs = async () => {
        axios
            .get(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/trending-blogs")
            .then(({ data }) => {
                setTrendingBlogs(data.blogs);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // blogs by category
    const fetchBlogsByCategory = async () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/search-blogs", {
                tag: pageState,
            })
            .then(({ data }) => {
                setBlogs(data.blogs);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    useEffect(() => {
        // vittual button click
        activeTabRef.current.click();

        if (pageState == "home") {
            fetchLatestBlogs();
        } else {
            fetchBlogsByCategory();
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageState]);

    const loadBlogByCategory = (e) => {
        const category = e.target.innerText.toLowerCase();
        setBlogs(null);

        // deselect category
        if (pageState == category) {
            setPageState("home");
            return;
        }

        setPageState(category);
    };

    return (
        <PageAnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* Latest / category blogs */}
                <div className="w-full">
                    <InpageNavigation
                        routes={[pageState, "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        <>
                            {blogs == null ? (
                                <Loader />
                            ) : blogs.length ? (
                                blogs.map((blog, i) => {
                                    return (
                                        <PageAnimationWrapper
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1,
                                            }}
                                            key={i}
                                        >
                                            <BlogPostCard
                                                content={blog}
                                                author={
                                                    blog.author.personal_info
                                                }
                                            />
                                        </PageAnimationWrapper>
                                    );
                                })
                            ) : (
                                <NoDataMessage message={"No blogs found"} />
                            )}
                        </>

                        {/* trending blogs */}
                        {trendingBlogs == null ? (
                            <Loader />
                        ) : (
                            trendingBlogs.length ? 
                            trendingBlogs.map((blog, i) => {
                                return (
                                    <PageAnimationWrapper
                                        transition={{
                                            duration: 1,
                                            delay: i * 0.1,
                                        }}
                                        key={i}
                                    >
                                        <MinimalBlogPostCard
                                            blog={blog}
                                            index={i}
                                        />
                                    </PageAnimationWrapper>
                                );
                            }) : <NoDataMessage message={"No trending blogs found"} />
                        )}
                    </InpageNavigation>
                </div>

                {/* filter and trending blogs(lg) */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        {/* cetegories (tags) */}
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Stories from all interests
                            </h1>

                            <div className="flex gap-3 flex-wrap">
                                {categories.map((category, i) => {
                                    return (
                                        <button
                                            className={`tag ${
                                                pageState == category
                                                    ? "bg-black text-white"
                                                    : ""
                                            }`}
                                            key={i}
                                            onClick={loadBlogByCategory}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* trending sec: lg */}
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending
                                <i className="fi fi-rr-arrow-trend-up ml-1"></i>
                            </h1>

                            {/* trending blogs */}
                            {trendingBlogs == null ? (
                                <Loader />
                            ) : (
                                trendingBlogs.length ? 
                                trendingBlogs.map((blog, i) => {
                                    return (
                                        <PageAnimationWrapper
                                            transition={{
                                                duration: 1,
                                                delay: i * 0.1,
                                            }}
                                            key={i}
                                        >
                                            <MinimalBlogPostCard
                                                blog={blog}
                                                index={i}
                                            />
                                        </PageAnimationWrapper>
                                    );
                                }) : <NoDataMessage message={"No trending blogs found"} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </PageAnimationWrapper>
    );
};

export default HomePage;
