import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageAnimationWrapper from "../components/common/PageAnimation";
import axios from "axios";
import toast from "react-hot-toast";
import BlogPostCard from "../components/blog/BlogPostCard";
import NoDataMessage from "../components/common/NoDataMessage";
import { filterPaginationData } from "../components/home/FilterPaginationData";
import LoadMoreDataBtn from "../components/common/LoadMoreDataBtn";
import BlogPostCardSkeleton from "../components/blog/skeleton/BlogPostCardSkeleton";

const TagPage = () => {
    let { tag } = useParams();
    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tagInfo, setTagInfo] = useState({
        name: tag,
        count: 0,
    });

    // Fetch blogs by tag
    const fetchBlogsByTag = async ({ page = 1 }) => {
        if (loading) return;
        setLoading(true);

        try {
            tag = tag.replace("-", " ");
            const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search-blogs`,
                { page, tag }
            );
            const { data: totalBlogCount } = await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/blogs/search-blogs-count`,
                { tag }
            )

            let formatedData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute: `/blogs/search-blogs-count`,
                data_to_send: { tag },
            });

            setBlogs(formatedData);
            setTagInfo(prev => ({
                ...prev,
                count: totalBlogCount?.totalDocs || prev.count
            }));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle infinite scroll
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = window.innerHeight;

        if (
            !loading &&
            blogs?.totalDocs > blogs?.results.length &&
            scrollTop + clientHeight >= scrollHeight - 200
        ) {
            const nextPage = blogs.page + 1;
            fetchBlogsByTag({ page: nextPage });
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [blogs, loading]);

    useEffect(() => {
        setBlogs(null);
        fetchBlogsByTag({ page: 1 });
        window.scrollTo(0, 0);
    }, [tag]);

    return (
        <PageAnimationWrapper>
            <section className="max-w-[1000px] mx-auto px-4 py-8">
                {/* Tag Header */}
                <div className="mb-10 text-center border-b border-grey pb-6">
                    <h1 className="text-4xl font-bold mb-4 capitalize">{tag}</h1>
                    <p className="text-dark-grey mb-2">
                        {`Explore articles tagged with ${tag}`}
                    </p>
                    <span className="text-dark-grey">
                        {tagInfo.count} {tagInfo.count === 1 ? 'story' : 'stories'}
                    </span>
                </div>

                {/* Blog Posts */}
                <div className="space-y-8">
                    {blogs === null ? (
                        [...Array(5)].map((_, i) => (
                            <BlogPostCardSkeleton key={i} />
                        ))
                    ) : blogs.results.length ? (
                        <>
                            {blogs.results.map((blog, i) => (
                                <PageAnimationWrapper
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    key={i}
                                >
                                    <BlogPostCard
                                        content={blog}
                                        author={blog.author.personal_info}
                                    />
                                </PageAnimationWrapper>
                            ))}

                            {loading && (
                                [...Array(3)].map((_, i) => (
                                    <BlogPostCardSkeleton key={i} />
                                ))
                            )}

                            <LoadMoreDataBtn
                                state={blogs}
                                fetchDataFunc={fetchBlogsByTag}
                            />
                        </>
                    ) : (
                        <NoDataMessage message={`No posts found tagged with "${tag}"`} />
                    )}
                </div>
            </section>
        </PageAnimationWrapper>
    );
};

export default TagPage;