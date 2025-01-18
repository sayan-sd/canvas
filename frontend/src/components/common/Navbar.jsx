import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import UserNavigationPanel from "../user/UserNavigationPanel";
import axios from "axios";

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const navigate = useNavigate();

    const { userAuth, setUserAuth } = useContext(UserContext);
    let accesss_token, profile_img, new_notification_available;
    if (userAuth != null && userAuth.access_token) {
        accesss_token = userAuth.access_token;
        profile_img = userAuth.profile_img;
        new_notification_available = userAuth.new_notification_available;
    }

    // Handle initial auth loading
    useEffect(() => {
        const checkAuth = () => {
            setTimeout(() => {
                setIsAuthLoading(false);
            }, 500);
        };

        checkAuth();
    }, []);

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 300);
    };

    // notification red dot
    useEffect(() => {
        if (accesss_token) {
            axios
                .get(
                    import.meta.env.VITE_SERVER_DOMAIN +
                        "/users/new-notifications",
                    {
                        headers: { Authorization: "Bearer " + accesss_token },
                    }
                )
                .then(({ data }) => {
                    setUserAuth({ ...userAuth, ...data });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [accesss_token]);

    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.key == "Enter" && query.length) {
            navigate(`/search/${query}`);
        }
    };

    return (
        <div>
            <nav className="navbar z-50">
                {/* Logo */}
                <Link to={"/"} className="flex-none w-10">
                    <img src={logo} alt="C\anvas Logo" className="w-full" />
                </Link>

                {/* Search Box */}
                <div
                    className={
                        "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
                        (searchBoxVisibility ? "show" : "hide")
                    }
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                        onKeyDown={handleSearch}
                    />

                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                {/* Toggle Search button in small and md screen */}
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button
                        className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() =>
                            setSearchBoxVisibility(!searchBoxVisibility)
                        }
                    >
                        <i className="i fi-rr-search text-xl"></i>
                    </button>

                    <Link to={"/editor"} className="hidden md:flex gap-2 link">
                        <p>Write</p>
                        <i className="fi fi-rr-file-edit"></i>
                    </Link>

                    {/* Auth dependent section */}
                    {isAuthLoading ? (
                        // Loading state
                        <div className="flex gap-3 md:gap-6 items-center">
                            <div className="w-12 h-12 rounded-full bg-grey/70 animate-pulse"></div>
                            <div className="w-12 h-12 rounded-full bg-grey animate-pulse"></div>
                        </div>
                    ) : accesss_token ? (
                        <>
                            {/* dashboard for logged in user */}
                            <Link to={"/dashboard/notifications"}>
                                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center">
                                    <i className="fi fi-rr-bell text-xl mt-1"></i>
                                    {new_notification_available ? (
                                        <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-3"></span>
                                    ) : (
                                        ""
                                    )}
                                </button>
                            </Link>

                            <div
                                className="relative"
                                onClick={() => setUserNavPanel(!userNavPanel)}
                                onBlur={handleBlur}
                            >
                                <button className="h-12 w-12 mt-1">
                                    <img
                                        src={profile_img}
                                        alt="Profile Image"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </button>

                                {userNavPanel ? <UserNavigationPanel /> : ""}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to={"/signin"} className="btn-dark py-2">
                                Login
                            </Link>

                            <Link
                                to={"/signup"}
                                className="btn-light py-2 hidden md:block"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </div>
    );
};

export default Navbar;
