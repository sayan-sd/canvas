import React, { useContext, useCallback, useEffect, useState } from "react";
import { BlogContext } from "../../../pages/BlogDisplayPage";
import CommentField from "./CommentField";
import axios from "axios";
import NoDataMessage from "../../common/NoDataMessage";
import PageAnimationWrapper from "../../common/PageAnimation";
import CommentCard from "./CommentCard";

// Fetch comments with pagination
export const fetchComments = async ({
    skip = 0,
    blog_id,
    setParentCommentCountFn,
    comment_array = null,
}) => {
    let res;

    await axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/get-blog-comments", {
            blog_id,
            skip,
        })
        .then(({ data }) => {
            data.map((comment) => {
                comment.childrenLevel = 0; // parent comment
            });

            setParentCommentCountFn((prev) => prev + data.length);

            if (comment_array == null) {
                res = { results: data };
            } else {
                res = { results: [...comment_array, ...data] };
            }
        });

    return res;
};

const CommentsContainer = () => {
    const [loading, setLoading] = useState(false);

    let {
        blog,
        blog: {
            _id,
            title,
            comments: { results: commentsArr },
            activity: { total_parent_comments },
        },
        setBlog,
        commentsWrapper,
        setCommentsWrapper,
        totalParentCommentsLoaded,
        setTotalParentCommentsLoaded,
    } = useContext(BlogContext);

    const loadMoreComments = async () => {
        if (loading) return;
        setLoading(true);

        try {
            let newCommentsArr = await fetchComments({
                skip: totalParentCommentsLoaded,
                blog_id: _id,
                setParentCommentCountFn: setTotalParentCommentsLoaded,
                comment_array: commentsArr
            });
            
            setBlog({ ...blog, comments: newCommentsArr });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Auto load handler
    const handleScroll = useCallback((e) => {
        const element = e.target;
        if (
            !loading && 
            total_parent_comments > totalParentCommentsLoaded &&
            // element.scrollHeight - element.scrollTop <= element.clientHeight + 100
            element.scrollHeight - element.scrollTop <= element.clientHeight + 10
        ) {
            loadMoreComments();
        }
    }, [loading, total_parent_comments, totalParentCommentsLoaded]);

    useEffect(() => {
        const commentsContainer = document.querySelector('.comments-scroll-container');
        if (commentsContainer) {
            commentsContainer.addEventListener('scroll', handleScroll);
            return () => commentsContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <div
            className={
                "comments-scroll-container max-sm:w-full fixed duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden z-[100] " +
                (commentsWrapper
                    ? " top-0 sm:right-0"
                    : " top-[100%] sm:right-[-100%]")
            }
        >
            {/* blog about */}
            <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-xl mt-2 w-[70%] text-dark-grey line-clamp-1">
                    {title}
                </p>

                <button
                    className="absolute top-0 right-0 flex items-center justify-center w-12 h-12 rounded-full bg-grey"
                    onClick={() => setCommentsWrapper(!commentsWrapper)}
                >
                    <i className="fi fi-br-cross text-xl flex items-center justify-center"></i>
                </button>
            </div>

            <hr className="border-grey my-8 w[120%] -ml-10" />

            {/* write comment */}
            <CommentField action={"comment"} />

            {/* map through prev comments */}
            {commentsArr && commentsArr.length ? (
                commentsArr.map((comment, i) => {
                    return (
                        <PageAnimationWrapper key={i}>
                            <CommentCard
                                index={i}
                                leftVal={4 * comment.childrenLevel}
                                commentData={comment}
                            />
                        </PageAnimationWrapper>
                    );
                })
            ) : (
                <NoDataMessage message={"No Comments Yet!"} />
            )}

            {/* Loading state */}
            {loading && (
                <div className="text-dark-grey text-center p-2">
                    Loading...
                </div>
            )}

            {/* load more comment button (still visible but loads automatically) */}
            {total_parent_comments > totalParentCommentsLoaded ? (
                <button 
                    className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" 
                    onClick={loadMoreComments}
                    disabled={loading}
                >
                    Load More
                </button>
            ) : (
                ""
            )}
        </div>
    );
};

export default CommentsContainer;