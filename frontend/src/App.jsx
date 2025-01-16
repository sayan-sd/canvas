import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./components/common/session";
import ResetPassword from "./components/auth/ResetPassword";
import Editor from "./pages/Editor";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PageNotFound404 from "./pages/PageNotFound404";
import UserProfilePage from "./pages/UserProfilePage";
import BlogDisplayPage from "./pages/BlogDisplayPage";
import SideNav from "./components/settings/SideNav";
import ChangePassword from "./pages/settings/ChangePassword";
import EditProfile from "./pages/settings/EditProfile";
import Notifications from "./pages/settings/Notifications";

export const UserContext = createContext({});

function App() {
    const [userAuth, setUserAuth] = useState();

    useEffect(() => {
        let userInSesstion = lookInSession("user");
        if (userInSesstion !== null) {
            setUserAuth(JSON.parse(userInSesstion));
        } else {
            setUserAuth({ access_token: null });
        }
    }, []);
    
    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                {/* Write Blog Route */}
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />
                
                <Route path="/" element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="/dashboard" element={<SideNav/>}>
                        <Route path="notifications" element={<Notifications />} />
                    </Route>
                    <Route path="/settings" element={<SideNav/>}>
                        <Route path="edit-profile" element={<EditProfile />} />
                        <Route path="change-password" element={<ChangePassword />} />
                    </Route>
                    <Route
                        path="/signin"
                        element={<UserAuthForm type={"sign-in"} />}
                    />
                    <Route
                        path="/signup"
                        element={<UserAuthForm type={"sign-up"} />}
                    />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/search/:query" element={<SearchPage />} />
                    <Route path="/user/:id" element={<UserProfilePage/>} />
                    <Route path="/blog/:blog_id" element={<BlogDisplayPage/>} />
                    <Route path="*" element={<PageNotFound404/>} />
                </Route>
            </Routes>
        </UserContext.Provider>
    );
}

export default App;
