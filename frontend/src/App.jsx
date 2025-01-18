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
import ManageBlogs from "./pages/settings/ManageBlogs";

export const UserContext = createContext({});
export const ThemeContext = createContext({});

const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
    const [userAuth, setUserAuth] = useState();
    const [theme, setTheme] = useState("light");
    // const [theme, setTheme] = useState(() => darkThemePreference() ? 'dark' : 'light');

    useEffect(() => {
        let userInSesstion = lookInSession("user");
        let themeInSesstion = lookInSession("theme");

        if (userInSesstion !== null) {
            setUserAuth(JSON.parse(userInSesstion));
        } else {
            setUserAuth({ access_token: null });
        }

        if (themeInSesstion) {
            setTheme(() => {
                document.body.setAttribute("data-theme", themeInSesstion);
                return themeInSesstion;
            });
        }
        else {
            document.body.setAttribute("data-theme", theme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
                <Routes>
                    {/* Write Blog Route */}
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:blog_id" element={<Editor />} />

                    <Route path="/" element={<Navbar />}>
                        <Route index element={<HomePage />} />
                        <Route path="/dashboard" element={<SideNav />}>
                            <Route path="blogs" element={<ManageBlogs />} />
                            <Route
                                path="notifications"
                                element={<Notifications />}
                            />
                        </Route>
                        <Route path="/settings" element={<SideNav />}>
                            <Route
                                path="edit-profile"
                                element={<EditProfile />}
                            />
                            <Route
                                path="change-password"
                                element={<ChangePassword />}
                            />
                        </Route>
                        <Route
                            path="/signin"
                            element={<UserAuthForm type={"sign-in"} />}
                        />
                        <Route
                            path="/signup"
                            element={<UserAuthForm type={"sign-up"} />}
                        />
                        <Route
                            path="/reset-password/:token"
                            element={<ResetPassword />}
                        />
                        <Route path="/search/:query" element={<SearchPage />} />
                        <Route path="/user/:id" element={<UserProfilePage />} />
                        <Route
                            path="/blog/:blog_id"
                            element={<BlogDisplayPage />}
                        />
                        <Route path="*" element={<PageNotFound404 />} />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
}

export default App;
