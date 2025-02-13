import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageAnimationWrapper from "../components/common/PageAnimation";
import Loader from "../components/common/Loader";
import { UserContext } from "../App";
import AboutUser from "../components/user/AboutUser";
import { filterPaginationData } from "../components/home/FilterPaginationData";
import InpageNavigation from "../components/home/InpageNavigation";
import BlogPostCard from "../components/blog/BlogPostCard";
import NoDataMessage from "../components/common/NoDataMessage";
import LoadMoreDataBtn from "../components/common/LoadMoreDataBtn";
import PageNotFound404 from "./PageNotFound404";
import UserProfilePageSkeleton from "../components/user/skeleton/UserProfilePageSkeleton";
import BlogPostCardSkeleton from "../components/blog/skeleton/BlogPostCardSkeleton";

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        bio: "",
        profile_img: "",
    },
    social_links: {},
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    joinedAt: "",
};

const UserProfilePage = () => {
    const { id: profileId } = useParams();
    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState(null);
    let [profileLoaded, setProfileLoaded] = useState("");

    const {
        personal_info: {
            fullname,
            username: profile_username,
            profile_img,
            bio,
        },
        account_info: { total_posts, total_reads },
        social_links,
        joinedAt,
    } = profile;

    const { userAuth } = useContext(UserContext);
    let username;
    if (userAuth != null) {
        username = userAuth.username;
    }

    // get user profile db call
    const fetchUserProfile = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/users/get-profile", {
                username: profileId,
            })
            .then(({ data }) => {
                const user = data.user;
                if (user != null) {
                    setProfile(user);
                }
                setProfileLoaded(profileId);
                getBlogs({ user_id: user._id });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const getBlogs = ({ page = 1, user_id }) => {
        user_id = user_id == undefined ? blogs.user_id : user_id;

        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/search-blogs", {
                author: user_id,
                page,
            })
            .then(async ({ data }) => {
                let formattedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/blogs/search-blogs-count",
                    data_to_send: { author: user_id },
                });

                formattedData.user_id = user_id;
                setBlogs(formattedData);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (profileId != profileLoaded) {
            setBlogs(null);
        }

        if (blogs == null) {
            resetStates();
            fetchUserProfile();
        }
    }, [profileId, blogs]);

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
        setProfileLoaded("");
    };

    return (
        <PageAnimationWrapper>
            {loading ? (
                <UserProfilePageSkeleton />
            ) : profile_username.length ? (
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    {/* User Profile Info */}
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[360px] md:w-[30%] md:pl-8 md:border-l border-grey md:top-[100px] md:py-10">
                        <img
                            src={profile_img}
                            alt="Profile Image"
                            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                        />

                        <h1 className="text-2xl font-medium">
                            @{profile_username}
                        </h1>
                        <p className="text-xl capitalize h-6">{fullname}</p>

                        <p>
                            {total_posts.toLocaleString()} Blogs -{" "}
                            {total_reads.toLocaleString()} Reads
                        </p>

                        {/* Edit profile button to auth user only */}
                        <div className="flex gap-4 mt-2">
                            {profileId == username ? (
                                <Link
                                    to={"/settings/edit-profile"}
                                    className="btn-light rounded-md"
                                >
                                    Edit Profile
                                </Link>
                            ) : (
                                ""
                            )}
                        </div>

                        {/* User About - lg */}
                        <AboutUser
                            className={"max-md:hidden"}
                            bio={bio.length ? bio : "Hey there! Check out my stories on Canvas!"}
                            social_links={social_links}
                            joindAt={joinedAt}
                        />
                    </div>

                    {/* User Posts - Blogs */}
                    <div className="max-md:mt-12 w-full">
                        <InpageNavigation
                            routes={["Blogs Published", "About"]}
                            defaultHidden={["About"]}
                            icons={["fi-rr-blog-pencil", "fi-rr-user"]}
                        >
                            <>
                                {blogs == null ? (
                                    [...Array(2)].map((_, i) => <BlogPostCardSkeleton key={i} />)
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
                                                    author={
                                                        blog.author
                                                            .personal_info
                                                    }
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
                                    fetchDataFunc={getBlogs}
                                />
                            </>

                            {/* about user */}
                            <AboutUser
                                bio={bio.length ? bio : "Hey there! Check out my stories on Canvas!"}
                                social_links={social_links}
                                joindAt={joinedAt}
                            />
                        </InpageNavigation>
                    </div>
                </section>
            ) : (
                <PageNotFound404 />
            )}
        </PageAnimationWrapper>
    );
};

export default UserProfilePage;
