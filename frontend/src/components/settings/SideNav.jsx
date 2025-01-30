import React, { useContext, useRef, useState, useEffect } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { UserContext } from "../../App";
import Loader from "../common/Loader";

const SideNav = () => {
    const [isLoading, setIsLoading] = useState(true);
    let { userAuth } = useContext(UserContext);
    let access_token, new_notification_available;
    if (userAuth != null) {
        access_token = userAuth.access_token;
        new_notification_available = userAuth.new_notification_available;
    }

    let page = location.pathname.split("/")[2];

    let [pageState, setPageState] = useState(
        page ? page.replace("-", " ") : ""
    );
    let [showSideNav, setShowSideNav] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    // Add effect to handle initial auth loading
    useEffect(() => {
        const checkAuth = () => {
            // Wait a brief moment for auth to initialize
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        checkAuth();
    }, []);

    const changePageState = (e) => {
        const target = e.currentTarget;
        const { offsetWidth, offsetLeft } = target;

        if (activeTabLine.current) {
            activeTabLine.current.style.width = `${offsetWidth}px`;
            activeTabLine.current.style.left = `${offsetLeft}px`;
        }

        if (target == sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    };

    // useEffect(() => {
    //     setShowSideNav(false);
    //     pageStateTab.current.click();
    // }, [pageState]);

    useEffect(() => {
        setShowSideNav(false);

        // Instead of triggering a click, directly call the logic
        if (pageStateTab.current) {
            const { offsetWidth, offsetLeft } = pageStateTab.current;

            if (activeTabLine.current) {
                activeTabLine.current.style.width = `${offsetWidth}px`;
                activeTabLine.current.style.left = `${offsetLeft}px`;
            }
        }
    }, [pageState]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return !isLoading && access_token == undefined ? (
        <Navigate to={"/signin"} />
    ) : (
        <>
            <section className=" relative flex gap-10 py-0 m-0 max-md:flex-col">
                <div className=" sticky top-[80px] z-30">
                    {/* settings menu for sm devices */}
                    <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                        <button
                            ref={sideBarIconTab}
                            className="p-5 capitalize"
                            onClick={changePageState}
                        >
                            <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                        </button>

                        <button
                            ref={pageStateTab}
                            className="p-5 capitalize"
                            onClick={changePageState}
                        >
                            {pageState}
                        </button>
                        <hr
                            ref={activeTabLine}
                            className="absolute bottom-0 duration-500"
                        />
                    </div>

                    {/* side nav */}
                    <div
                        className={
                            "min-w-[200px] h-[calc(100vh-80px-64px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
                            (!showSideNav
                                ? "max-md:opacity-0 max-md:pointer-events-none"
                                : "opacity-100 pointer-events-auto")
                        }
                    >
                        <h1 className="text-xl text-dark-grey mb-3">
                            Dashboard
                        </h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink
                            to={"/dashboard/blogs"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <i className="fi fi-rr-document"></i>
                            Blogs
                        </NavLink>

                        <NavLink
                            to={"/dashboard/notifications"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <div className="relative">
                                <i className="fi fi-rr-bell"></i>
                                {new_notification_available ? (
                                    <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                                ) : (
                                    ""
                                )}
                            </div>
                            Notifications
                        </NavLink>

                        <NavLink
                            to={"/dashboard/bookmarks"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <i className="fi fi-rr-book-bookmark"></i>
                            Bookmarks
                        </NavLink>

                        <NavLink
                            to={"/editor"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <i className="fi fi-rr-file-edit"></i>
                            Write
                        </NavLink>

                        <h1 className="text-xl text-dark-grey mt-20 mb-3">
                            Settings
                        </h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink
                            to={"/settings/edit-profile"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <i className="fi fi-rr-user"></i>
                            Edit Profile
                        </NavLink>

                        <NavLink
                            to={"/settings/change-password"}
                            onClick={(e) => setPageState(e.target.innerText)}
                            className={"sidebar-link"}
                        >
                            <i className="fi fi-rr-lock"></i>
                            Change Password
                        </NavLink>
                    </div>
                </div>

                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>
            </section>
        </>
    );
};

export default SideNav;
