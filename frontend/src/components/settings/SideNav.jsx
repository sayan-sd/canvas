import React, { useContext, useRef, useState, useEffect } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { ThemeContext, UserContext } from "../../App";
import Loader from "../common/Loader";

const SideNav = () => {
    const [isLoading, setIsLoading] = useState(true);

    const { theme } = useContext(ThemeContext);

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
        <Navigate to="/signin" />
    ) : (
        <>
            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <div className="sticky top-[70px] z-40 bg-white border-grey border-r p-6 shadow-sm min-w-[200px] md:w-[240px] h-[calc(100vh-70px-64px)]">
                        <h1 className="text-xl text-dark-grey mb-3">
                            Dashboard
                        </h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />
                        <nav className="space-y-4">
                            <NavLink
                                to="/dashboard/blogs"
                                onClick={(e) =>
                                    setPageState(e.target.innerText)
                                }
                                className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200"
                            >
                                <i className="fi fi-rr-document mr-3"></i>
                                Blogs
                            </NavLink>

                            <NavLink
                                to="/dashboard/notifications"
                                onClick={(e) =>
                                    setPageState(e.target.innerText)
                                }
                                className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200 relative"
                            >
                                <i className="fi fi-rr-bell mr-3"></i>
                                Notifications
                                {new_notification_available && (
                                    <span className="bg-red w-2 h-2 rounded-full absolute top-3 right-3"></span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/dashboard/bookmarks"
                                onClick={(e) =>
                                    setPageState(e.target.innerText)
                                }
                                className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200"
                            >
                                <i className="fi fi-rr-book-bookmark mr-3"></i>
                                Bookmarks
                            </NavLink>

                            <NavLink
                                to="/editor"
                                onClick={(e) =>
                                    setPageState(e.target.innerText)
                                }
                                className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200"
                            >
                                <i className="fi fi-rr-file-edit mr-3"></i>
                                Write
                            </NavLink>
                        </nav>
                        <div className="mt-10">
                            <h1 className="text-xl text-dark-grey mb-3">
                                Settings
                            </h1>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />
                            <nav className="space-y-4">
                                <NavLink
                                    to="/settings/edit-profile"
                                    onClick={(e) =>
                                        setPageState(e.target.innerText)
                                    }
                                    className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200"
                                >
                                    <i className="fi fi-rr-user mr-3"></i>
                                    Edit Profile
                                </NavLink>

                                <NavLink
                                    to="/settings/change-password"
                                    onClick={(e) =>
                                        setPageState(e.target.innerText)
                                    }
                                    className="sidebar-link flex items-center p-3 rounded hover:bg-grey transition duration-200"
                                >
                                    <i className="fi fi-rr-lock mr-3"></i>
                                    Change Password
                                </NavLink>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden relative">
                    {/* Top Navbar */}
                    <div
                        className={`bg-white border-b border-grey sticky top-0 z-40 flex items-center justify-between p-4 duration-300`}
                    >
                        <button
                            ref={sideBarIconTab}
                            onClick={() => setShowSideNav(true)}
                            className="p-2 focus:outline-none"
                        >
                            <i className="fi fi-rr-bars-staggered text-xl"></i>
                        </button>
                        <button
                            ref={pageStateTab}
                            onClick={changePageState}
                            className="p-2 capitalize focus:outline-none"
                        >
                            {pageState}
                        </button>
                        <div className="w-6" /> {/* Spacer */}
                    </div>

                    {/* Slide-in Sidebar from the Left */}
                    <div
                        className={`fixed top-[64px] left-0 bottom-0 w-[80%] max-w-sm bg-white border-r border-grey shadow-md transform transition-transform duration-300 z-50 ${
                            showSideNav ? "translate-x-0" : "-translate-x-full"
                        }`}
                    >
                        <div className="p-6 overflow-y-auto h-full">
                            {/* Dashboard Header with Close (X) Button */}
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-xl text-dark-grey">
                                    Dashboard
                                </h1>
                                <button
                                    onClick={() => setShowSideNav(false)}
                                    className="p-2 focus:outline-none"
                                >
                                    <i className="fi fi-rr-cross text-xl"></i>
                                </button>
                            </div>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />

                            {/* Navigation Links */}
                            <nav className="space-y-4">
                                <NavLink
                                    to="/dashboard/blogs"
                                    onClick={(e) => {
                                        setPageState(e.target.innerText);
                                        setShowSideNav(false);
                                    }}
                                    className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200"
                                >
                                    <i className="fi fi-rr-document mr-3"></i>
                                    Blogs
                                </NavLink>

                                <NavLink
                                    to="/dashboard/notifications"
                                    onClick={(e) => {
                                        setPageState(e.target.innerText);
                                        setShowSideNav(false);
                                    }}
                                    className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200 relative"
                                >
                                    <i className="fi fi-rr-bell mr-3"></i>
                                    Notifications
                                    {new_notification_available && (
                                        <span className="bg-red w-2 h-2 rounded-full absolute top-3 right-3"></span>
                                    )}
                                </NavLink>

                                <NavLink
                                    to="/dashboard/bookmarks"
                                    onClick={(e) => {
                                        setPageState(e.target.innerText);
                                        setShowSideNav(false);
                                    }}
                                    className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200"
                                >
                                    <i className="fi fi-rr-book-bookmark mr-3"></i>
                                    Bookmarks
                                </NavLink>

                                <NavLink
                                    to="/editor"
                                    onClick={(e) => {
                                        setPageState(e.target.innerText);
                                        setShowSideNav(false);
                                    }}
                                    className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200"
                                >
                                    <i className="fi fi-rr-file-edit mr-3"></i>
                                    Write
                                </NavLink>
                            </nav>

                            {/* Settings Section */}
                            <div className="mt-10">
                                <h1 className="text-xl text-dark-grey mb-3">
                                    Settings
                                </h1>
                                <hr className="border-grey -ml-6 mb-8 mr-6" />
                                <nav className="space-y-4">
                                    <NavLink
                                        to="/settings/edit-profile"
                                        onClick={(e) => {
                                            setPageState(e.target.innerText);
                                            setShowSideNav(false);
                                        }}
                                        className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200"
                                    >
                                        <i className="fi fi-rr-user mr-3"></i>
                                        Edit Profile
                                    </NavLink>

                                    <NavLink
                                        to="/settings/change-password"
                                        onClick={(e) => {
                                            setPageState(e.target.innerText);
                                            setShowSideNav(false);
                                        }}
                                        className="sidebar-link block p-3 rounded hover:bg-grey transition duration-200"
                                    >
                                        <i className="fi fi-rr-lock mr-3"></i>
                                        Change Password
                                    </NavLink>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Background Overlay (click to dismiss the sidebar) */}
                    {showSideNav && (
                        <div
                            onClick={() => setShowSideNav(false)}
                            className={`fixed inset-0 ${
                                theme == "light" ? "bg-[#000] opacity-20" : "bg-[#333] opacity-30"
                            } z-40`}
                        ></div>
                    )}
                </div>

                {/* Main Content */}
                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>
            </section>
        </>
    );
};

export default SideNav;
