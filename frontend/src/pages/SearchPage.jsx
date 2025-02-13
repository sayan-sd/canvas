import React, { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import InpageNavigation, {
    activeTabRef,
} from "../components/home/InpageNavigation";
import Loader from "../components/common/Loader";
import BlogPostCard from "../components/blog/BlogPostCard";
import NoDataMessage from "../components/common/NoDataMessage";
import LoadMoreDataBtn from "../components/common/LoadMoreDataBtn";
import axios from "axios";
import { filterPaginationData } from "../components/home/FilterPaginationData";
import PageAnimationWrapper from "../components/common/PageAnimation";
import UserCard from "../components/user/UserCard";
import BlogPostCardSkeleton from "../components/blog/skeleton/BlogPostCardSkeleton";
import UserCardSkeleton from "../components/user/skeleton/UserCardSkeleton";

const SearchPage = () => {
    let { query } = useParams();

    const [blogs, setBlog] = useState(null);
    const [users, setUsers] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/search-blogs", {
                query,
                page,
            })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/blogs/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr,
                });
                // console.log(formatedData);
                setBlog(formatedData);
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    // search user
    const fetchUsers = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/users/search-users", {
                query,
            })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    // render on every new query
    useEffect(() => {
        // virtual click on active tab
        activeTabRef.current.click();

        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUsers();
    }, [query]);

    const resetState = () => {
        setBlog(null);
        setUsers(null);
    };

    // User cards wrapper
    const UserCardWrapper = () => {
        return (
            <>
                {users == null ? (
                    [...Array(2)].map((_, i) => <UserCardSkeleton key={i} />)
                ) : users.length ? (
                    users.map((user, i) => {
                        return (
                            <PageAnimationWrapper
                                key={i}
                                transition={{ duration: 1, delay: i * 0.08 }}
                            >
                                <UserCard user={user} />
                            </PageAnimationWrapper>
                        );
                    })
                ) : (
                    <NoDataMessage message={"No user found"} />
                )}
            </>
        );
    };

    return (
        <section className="h-cover flex justify-center gap-10">
            {/* small screen */}
            <div className="w-full">
                {/* search & account navigation */}
                <InpageNavigation
                    routes={[
                        `Search Results for "${query}"`,
                        "Accounts Matched",
                    ]}
                    defaultHidden={"Accounts Matched"}
                >
                    {/* Blogs Search Data */}
                    <>
                        {blogs == null ? (
                            [...Array(2)].map((_, i) => (
                                <BlogPostCardSkeleton key={i} />
                            ))
                        ) : blogs.results.length ? (
                            blogs.results.map((blog, i) => {
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
                                            author={blog.author.personal_info}
                                        />
                                    </PageAnimationWrapper>
                                );
                            })
                        ) : (
                            <NoDataMessage message={"No blogs found"} />
                        )}

                        {/* Load more button */}
                        <LoadMoreDataBtn
                            state={blogs}
                            fetchDataFunc={searchBlogs}
                        />
                    </>

                    {/* Users Search Data */}
                    <UserCardWrapper />
                </InpageNavigation>
            </div>

            {/* large scrren view */}
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8 gap-1 flex items-end">
                    User releted to search
                    <i className="fi fi-rr-user text-xl"></i>
                </h1>
                <UserCardWrapper />
            </div>
        </section>
    );
};

export default SearchPage;
