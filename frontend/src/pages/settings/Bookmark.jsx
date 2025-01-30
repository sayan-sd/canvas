import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import BlogPostCard from "../../components/blog/BlogPostCard";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import Loader from "../../components/common/Loader";
import NoDataMessage from "../../components/common/NoDataMessage";

const Bookmark = () => {
    const [bookmarks, setBookmarks] = useState(null);
    const [filteredBookmarks, setFilteredBookmarks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const { userAuth } = useContext(UserContext);

    useEffect(() => {
        if (userAuth?.access_token) {
            fetchBookmarks();
        }
    }, [userAuth]);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/users/bookmarks",
                { page: 1, limit: 10 },
                {
                    headers: {
                        Authorization: `Bearer ${userAuth.access_token}`,
                    },
                }
            );
            setBookmarks(data.blogs);
            setFilteredBookmarks(data.blogs);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setQuery(searchQuery);

        if (!searchQuery.length) {
            setFilteredBookmarks(bookmarks);
        } else {
            const results = bookmarks.filter((blog) =>
                blog.title.toLowerCase().includes(searchQuery)
            );
            setFilteredBookmarks(results);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <h1 className="max-md:hidden">Your Reading List</h1>

            {/* Search Box */}
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Your Blogs..."
                    value={query}
                    onChange={handleSearch} // Filters in real-time
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>

            {filteredBookmarks?.length ? (
                filteredBookmarks.map((blog, i) => (
                    <PageAnimationWrapper
                        transition={{
                            duration: 1,
                            delay: i * 0.1,
                        }}
                        key={i}
                    >
                        <BlogPostCard
                            content={blog}
                            author={blog.author.personal_info}
                        />
                    </PageAnimationWrapper>
                ))
            ) : (
                <NoDataMessage message="No bookmarks found" />
            )}
        </>
    );
};

export default Bookmark;
