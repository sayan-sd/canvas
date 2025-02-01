import React, { useEffect, useState, useCallback } from "react";
import PageAnimationWrapper from "../components/common/PageAnimation";
import InpageNavigation, {
    activeTabRef,
} from "../components/home/InpageNavigation";
import axios from "axios";
import toast from "react-hot-toast";
import BlogPostCard from "../components/blog/BlogPostCard";
import MinimalBlogPostCard from "../components/blog/MinimalBlogPostCard";
import NoDataMessage from "../components/common/NoDataMessage";
import { filterPaginationData } from "../components/home/FilterPaginationData";
import LoadMoreDataBtn from "../components/common/LoadMoreDataBtn";
import BlogPostCardSkeleton from "../components/blog/skeleton/BlogPostCardSkeleton";
import MinimalBlogPostCardSkeleton from "../components/blog/skeleton/MinimalBlogPostCardSkeleton";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import UserCard from "../components/user/UserCard";
import UserCardSkeleton from "../components/user/skeleton/UserCardSkeleton";

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState("home");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const navigate = useNavigate();

    const categories = [
        "technology",
        "lifestyle",
        "ai",
        "entertainment",
        "health",
        "travel",
        "adventure",
        "programming",
    ];

    // latest blogs
    const fetchLatestBlogs = async ({ page = 1 }) => {
        if (loading) return;
        setLoading(true);

        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/latest-blogs", {
                page,
            })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/blogs/all-latest-blogs-count",
                });
                setBlogs(formatedData);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
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

    // top users
    const fetchUsers = async () => {
        axios
            .get(import.meta.env.VITE_SERVER_DOMAIN + "/users/whom-to-follow")
            .then(({ data }) => {
                setUsers(data);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // blogs by category
    const fetchBlogsByCategory = async () => {
        navigate(`/tag/${pageState}`);
    };

    // Auto load more handler
    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        // Check if near bottom and have more content to load
        if (
            !loading &&
            blogs?.totalDocs > blogs?.results.length &&
            scrollTop + clientHeight >= scrollHeight - 100
            // scrollTop + clientHeight >= scrollHeight - 500
        ) {
            const nextPage = blogs.page + 1;
            if (pageState === "home") {
                fetchLatestBlogs({ page: nextPage });
            } else {
                fetchBlogsByCategory({ page: nextPage });
            }
        }
    }, [blogs, loading, pageState]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        // virtual button click
        activeTabRef.current.click();

        if (pageState == "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogsByCategory();
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
        if (users == null) {
            fetchUsers();
        }
        window.scrollTo(0, 0);
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
            <section className="h-cover flex flex-col md:flex-row justify-center gap-5 md:gap-10 pt-5">
                {/* categories for small devices */}
                {/* categories (tags) */}
                <div className="w-full overflow-x-auto no-scrollbar md:hidden">
                    <div className="flex gap-3 whitespace-nowrap">
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

                {/* Latest / category blogs */}
                <div className="w-full">
                    <InpageNavigation
                        routes={[pageState, "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                        icons={["fi-rr-home", "fi-rr-arrow-trend-up"]}
                    >
                        <>
                            {blogs == null ? (
                                [...Array(5)].map((_, i) => (
                                    <BlogPostCardSkeleton key={i} />
                                ))
                            ) : blogs.results.length ? (
                                <>
                                    {blogs.results.map((blog, i) => {
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
                                                        blog.author
                                                            .personal_info
                                                    }
                                                />
                                            </PageAnimationWrapper>
                                        );
                                    })}

                                    {/* Show loading indicator when fetching more */}
                                    {loading &&
                                        [...Array(3)].map((_, i) => (
                                            <BlogPostCardSkeleton key={i} />
                                        ))}

                                    {/* Keep the load more button visible but data will load automatically */}
                                    <LoadMoreDataBtn
                                        state={blogs}
                                        fetchDataFunc={
                                            pageState == "home"
                                                ? fetchLatestBlogs
                                                : fetchBlogsByCategory
                                        }
                                    />
                                </>
                            ) : (
                                <NoDataMessage message={"No blogs found"} />
                            )}
                        </>

                        {/* trending blogs */}
                        {trendingBlogs == null ? (
                            [...Array(5)].map((_, i) => (
                                <MinimalBlogPostCardSkeleton key={i} />
                            ))
                        ) : trendingBlogs.length ? (
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
                            })
                        ) : (
                            <NoDataMessage
                                message={"No trending blogs found"}
                            />
                        )}
                    </InpageNavigation>
                </div>

                {/* filter and trending blogs(lg) */}
                <div className="min-w-[30%] lg:min-w-[360px] max-w-min border-l border-grey pl-10 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        {/* trending sec: lg */}
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending
                                <i className="fi fi-rr-arrow-trend-up ml-1"></i>
                            </h1>

                            {/* trending blogs */}
                            {trendingBlogs == null ? (
                                [...Array(5)].map((_, i) => (
                                    <MinimalBlogPostCardSkeleton key={i} />
                                ))
                            ) : trendingBlogs.length ? (
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
                                })
                            ) : (
                                <NoDataMessage
                                    message={"No trending blogs found"}
                                />
                            )}
                        </div>

                        {/* categories (tags) */}
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Recommended topics
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

                        {/* whome to follow */}
                        <div className="mt-8">
                            <h1 className="font-medium text-xl mb-8">
                                Top Storyteller for you
                            </h1>

                            <div className="gap-3 flex-col flex">
                                {users == null ? (
                                    [...Array(3)].map((_, i) => (
                                        <UserCardSkeleton key={i} />
                                    ))
                                ) : users.length ? (
                                    users.map((user, i) => {
                                        return (
                                            <PageAnimationWrapper
                                                key={i}
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.08,
                                                }}
                                            >
                                                <UserCard user={user} />
                                            </PageAnimationWrapper>
                                        );
                                    })
                                ) : (
                                    <NoDataMessage message={"No user found"} />
                                )}
                            </div>
                        </div>

                        {/* reading list */}
                        <div className="mt-2">
                            <h1 className="font-medium text-xl mb-4">
                                Reading List
                            </h1>

                            <p className="text-lg leading-6">
                                Click the{" "}
                                <span className="font-bold">
                                    <i className="fi fi-rr-bookmark mx-1"></i>
                                </span>{" "}
                                on any story to easily add it to your reading
                                list or a custom list for better organization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </PageAnimationWrapper>
    );
};

export default HomePage;
