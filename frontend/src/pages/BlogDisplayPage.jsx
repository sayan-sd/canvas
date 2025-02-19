import React, { createContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageAnimationWrapper from "../components/common/PageAnimation";
import { getDay } from "../utils/DateFormatter";
import BlogInteraction from "../components/blog/BlogInteraction";
import BlogPostCard from "../components/blog/BlogPostCard";
import BlogContent from "../components/blog/BlogContent";
import CommentsContainer, {
    fetchComments,
} from "../components/blog/comment/CommentsContainer";
import BlogDisplayPageSkeleton from "../components/blog/skeleton/BlogDisplayPageSkeleton";

// empty blog structure
export const blogStructure = {
    title: "",
    des: "",
    content: [],
    author: { personal_info: {} },
    banner: "",
    publishedAt: "",
};

export const BlogContext = createContext({});

const BlogDisplayPage = () => {
    const { blog_id } = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    const [similarBlogs, setSimilarBlogs] = useState(null);
    const [isLikedByUser, setIsLikedByUser] = useState(false);
    const [commentsWrapper, setCommentsWrapper] = useState(false);
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);
    const navigate = useNavigate();

    let {
        title,
        content,
        banner,
        des,
        tags,
        author: {
            personal_info: { fullname, username: author_username, profile_img },
        },
        publishedAt,
    } = blog;

    const fetchBlog = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/get-blog", {
                blog_id,
            })
            .then(async ({ data }) => {
                const blog = data.blog;
                blog.comments = await fetchComments({
                    blog_id: blog._id,
                    setParentCommentCountFn: setTotalParentCommentsLoaded,
                });

                setBlog(blog);
                // console.log(blog)

                // similar blogs - same tag
                axios
                    .post(
                        import.meta.env.VITE_SERVER_DOMAIN +
                            "/blogs/search-blogs",
                        { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id }
                    )
                    .then(({ data }) => {
                        setSimilarBlogs(data.blogs);
                        // console.log(data.blogs);
                    });

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        resetState();
        fetchBlog();
        window.scrollTo(0, 0);
    }, [blog_id]);

    const resetState = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setIsLikedByUser(false);
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0);
    };

    return (
        <PageAnimationWrapper>
            {loading ? (
                <BlogDisplayPageSkeleton />
            ) : (
                <BlogContext.Provider
                    value={{
                        blog,
                        setBlog,
                        isLikedByUser,
                        setIsLikedByUser,
                        commentsWrapper,
                        setCommentsWrapper,
                        totalParentCommentsLoaded,
                        setTotalParentCommentsLoaded,
                    }}
                >
                    {/* Comments Section */}
                    <CommentsContainer />

                    <div className="min-h-screen">
                        <div className="max-w-5xl mx-auto py-12 px-6">
                            {/* Title & Description */}
                            <div className="mb-8 text-center">
                                <h1 className="text-4xl font-bold mb-4">
                                    {title}
                                </h1>
                                <p className="text-lg md:max-w-[75%] center text-dark-grey line-clamp-3">
                                    {des}
                                </p>
                            </div>

                            {/* Banner Image */}
                            <div className="rounded-lg overflow-hidden shadow-lg mb-8">
                                <img
                                    src={banner}
                                    alt="Blog Banner"
                                    className="w-full object-cover aspect-video"
                                    style={{ maxHeight: "400px" }}
                                />
                            </div>

                            {/* Author & Publication Details */}
                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img
                                        src={profile_img}
                                        alt="User Image"
                                        className="w-12 h-12 rounded-full"
                                    />

                                    <p>
                                        <span className=" capitalize">
                                            {fullname}
                                        </span>{" "}
                                        <br />@
                                        <Link
                                            to={`/user/${author_username}`}
                                            className=" underline"
                                        >
                                            {author_username}
                                        </Link>
                                    </p>
                                </div>

                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                                    Published on {getDay(publishedAt)}
                                </p>
                            </div>

                            {/* Blog Interaction (Top) */}
                            <BlogInteraction />

                            {/* Blog Content */}
                            <div className="mt-8 blog-page-content max-w-none">
                                {content[0].blocks.map((block, i) => (
                                    <div key={i} className="my-4">
                                        <BlogContent block={block} />
                                    </div>
                                ))}
                            </div>

                            {/* Blog Interaction (Bottom) */}
                            <BlogInteraction />

                            {/* Tags Section */}
                            {tags && tags.length ? (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    {tags.map((tag, idx) => (
                                        <button
                                            key={idx}
                                            className="bg-grey px-3 py-1 hover:underline rounded-full text-sm"
                                            onClick={() =>
                                                navigate(
                                                    `/tag/${tag.replace(
                                                        " ",
                                                        "-"
                                                    )}`
                                                )
                                            }
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            {/* Similar Blogs Section */}
                            {similarBlogs != null && similarBlogs.length ? (
                                <>
                                    <h1 className="text-2xl mt-14 mb-6 font-medium">
                                        Similar Blogs
                                    </h1>

                                    {similarBlogs.map((blog, i) => {
                                        let {
                                            author: { personal_info },
                                        } = blog;
                                        return (
                                            <PageAnimationWrapper
                                                key={i}
                                                transition={{
                                                    duration: 1,
                                                    delay: i * 0.08,
                                                }}
                                            >
                                                <BlogPostCard
                                                    content={blog}
                                                    author={personal_info}
                                                />
                                            </PageAnimationWrapper>
                                        );
                                    })}
                                </>
                            ) : null}
                        </div>
                    </div>
                </BlogContext.Provider>
            )}
        </PageAnimationWrapper>
    );
};

export default BlogDisplayPage;
