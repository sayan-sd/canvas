import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { filterPaginationData } from "../../components/home/FilterPaginationData";
import InpageNavigation from "../../components/home/InpageNavigation";
import Loader from "../../components/common/Loader";
import NoDataMessage from "../../components/common/NoDataMessage";
import PageAnimationWrapper from "../../components/common/PageAnimation";
import {
    ManageDraftBlogCard,
    ManagePublishedBlogCard,
} from "../../components/settings/ManagePublishedBlogCard";
import LoadMoreDataBtn from "../../components/common/LoadMoreDataBtn";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null);
    const [query, setQuery] = useState("");

    let activeTab = useSearchParams()[0].get("tab");

    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN +
                    "/users/user-written-blogs",
                { page, draft, query, deletedDocCount },
                { headers: { Authorization: "Bearer " + access_token } }
            )
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: draft ? drafts : blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/users/user-written-blogs-count",
                    data_to_send: { draft, query },
                    user: access_token,
                });
                // console.log(formattedData);

                if (draft) {
                    setDrafts(formattedData);
                } else {
                    setBlogs(formattedData);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (access_token) {
            if (blogs == null) {
                getBlogs({ page: 1, draft: false });
            }
            if (drafts == null) {
                getBlogs({ page: 1, draft: true });
            }
        }
    }, [access_token, blogs, drafts, query]);

    const handleSearch = (e) => {
        let searchQuery = e.target.value;
        setQuery(searchQuery);

        if (e.keyCode == 13 && searchQuery.length) {
            setBlogs(null);
            setDrafts(null);
        }
    };

    const handleChange = (e) => {
        if (!e.target.value.length) {
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }
    };

    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            {/* serach box */}
            <div className=" relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Your Blogs..."
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>

            <InpageNavigation
                routes={["Published Blogs", "Drafts"]}
                defaultActiveIndex={activeTab != "draft" ? 0 : 1}
            >
                {/* published blogs */}
                {blogs == null ? (
                    <Loader />
                ) : blogs.results.length ? (
                    <>
                        {blogs.results.map((blog, i) => {
                            return (
                                <PageAnimationWrapper
                                    key={i}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <ManagePublishedBlogCard
                                        blog={{
                                            ...blog,
                                            index: i,
                                            setStateFn: setBlogs,
                                        }}
                                    />
                                </PageAnimationWrapper>
                            );
                        })}

                        {/* pagination */}
                        <LoadMoreDataBtn
                            state={blogs}
                            fetchDataFunc={getBlogs}
                            additionalParams={{
                                draft: false,
                                deletedDocCount: blogs.deletedDocCount,
                            }}
                        />
                    </>
                ) : (
                    <NoDataMessage message={"No Published Blogs"} />
                )}

                {/* draft */}
                {drafts == null ? (
                    <Loader />
                ) : drafts.results.length ? (
                    <>
                        {drafts.results.map((blog, i) => {
                            return (
                                <PageAnimationWrapper
                                    key={i}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <ManageDraftBlogCard
                                        blog={{
                                            ...blog,
                                            index: i,
                                            setStateFn: setDrafts,
                                        }}
                                    />
                                </PageAnimationWrapper>
                            );
                        })}

                        {/* pagination */}
                        <LoadMoreDataBtn
                            state={drafts}
                            fetchDataFunc={getBlogs}
                            additionalParams={{
                                draft: true,
                                deletedDocCount: drafts.deletedDocCount,
                            }}
                        />
                    </>
                ) : (
                    <NoDataMessage message={"No Blogs in Draft"} />
                )}
            </InpageNavigation>
        </>
    );
};

export default ManageBlogs;
