import React, { useContext } from "react";
import PageAnimationWrapper from "../common/PageAnimation";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { removeFromSession } from "../common/session";


const UserNavigationPanel = () => {
    const { userAuth, setUserAuth } = useContext(UserContext);
    let username;
    if (userAuth) {
        username = userAuth.username;
    }

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({access_token: null});
    };

    return (
        <PageAnimationWrapper transition={{ duration: 0.2 }} className={"absolute right-0 z-[70]"}>
            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                {/* write tab (for small devices) */}
                <Link
                    to={"/editor"}
                    className="flex gap-2 link md:hidden pl-8 py-4 items-center"
                >
                    <i className="fi fi-rr-file-edit"></i>
                    Write
                </Link>

                {/* Profile */}
                <Link to={`/user/${username}`} className="link pl-8 py-4">
                    Profile
                </Link>

                {/* Dashboard */}
                <Link to={`/dashboard/blogs`} className="link pl-8 py-4">
                    Dashboard
                </Link>

                {/* settings */}
                <Link to={`/settings/edit-profile`} className="link pl-8 py-4">
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]"></span>

                {/* sign out button */}
                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick={signOutUser}>
                    <h1 className="font-bold text-xl mb-1">Sign Out</h1>
                    <p className="text-dark-grey">@{ username }</p>
                </button>
            </div>
        </PageAnimationWrapper>
    );
};

export default UserNavigationPanel;
