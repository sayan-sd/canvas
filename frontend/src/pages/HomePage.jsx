import React, { useEffect, useState, useCallback, useRef } from "react";
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

const HomePage = () => {
    const [blogs, setBlogs] = useState(null);
    const [trendingBlogs, setTrendingBlogs] = useState(null);
    const [pageState, setPageState] = useState("home");
    const [loading, setLoading] = useState(false);

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

    // blogs by category
    const fetchBlogsByCategory = async ({ page = 1 }) => {
        if (loading) return;
        setLoading(true);

        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/search-blogs", {
                tag: pageState,
                page,
            })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/blogs/search-blogs-count",
                    data_to_send: { tag: pageState },
                });
                setBlogs(formatedData);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
            });
    };

    // Auto load more handler
    const handleScroll = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        // Check if we're near bottom and have more content to load
        if (
            !loading &&
            blogs?.totalDocs > blogs?.results.length &&
            scrollTop + clientHeight >= scrollHeight - 200
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

    // Expose the ref to window or pass it through context if needed
    useEffect(() => {
        window.homePageRef = homePageRef.current;
    }, [pageState]);

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
            fetchBlogsByCategory({ page: 1 });
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
        window.scrollTo(0, 0);
    }, [pageState]);

    // Directly create the ref
    const homePageRef = useRef({
        resetCategory: () => {
            // Use functional update to ensure correct state
            setPageState((currentState) => {
                if (currentState != "home") {
                    setBlogs(null);
                    setPageState("home");
                }
                return "home";
            });
        },
    });

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
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        {/* categories (tags) */}
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
                    </div>
                </div>
            </section>
        </PageAnimationWrapper>
    );
};

export default HomePage;
