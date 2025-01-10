import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageAnimationWrapper from "../components/common/PageAnimation";
import Loader from "../components/common/Loader";
import { getDay } from "../utils/DateFormatter";
import BlogInteraction from "../components/blog/BlogInteraction";
import BlogPostCard from "../components/blog/BlogPostCard";
import BlogContent from "../components/blog/BlogContent";
import CommentsContainer, {
    fetchComments,
} from "../components/blog/comment/CommentsContainer";

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
    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] =
        useState(0);

    let {
        title,
        content,
        banner,
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
                <Loader />
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
                    {/* comment Card */}
                    <CommentsContainer />

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                        <img
                            src={banner}
                            alt="Blog Banner"
                            className="aspect-video rounded-md"
                        />

                        {/* user details */}
                        <div className="mt-12">
                            <h2>{title}</h2>

                            {/* author */}
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
                        </div>

                        {/* blog activity */}
                        <BlogInteraction />

                        {/* Blog Content */}
                        <div className="my-12 font-gelasio blog-page-content">
                            {content[0].blocks.map((block, i) => {
                                return (
                                    <div key={i} className="my-4 md:my-8">
                                        <BlogContent block={block} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* blog activiy */}
                        <BlogInteraction />

                        {/* similar blogs */}
                        {similarBlogs != null && similarBlogs.length ? (
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">
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
                        ) : (
                            ""
                        )}
                    </div>
                </BlogContext.Provider>
            )}
        </PageAnimationWrapper>
    );
};

export default BlogDisplayPage;
