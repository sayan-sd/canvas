import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./components/common/session";
import ResetPassword from "./components/auth/ResetPassword";
import Editor from "./pages/Editor";

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
                
                <Route path="/" element={<Navbar />}>
                    <Route
                        path="/signin"
                        element={<UserAuthForm type={"sign-in"} />}
                    />
                    <Route
                        path="/signup"
                        element={<UserAuthForm type={"sign-up"} />}
                    />
                    <Route path="/reset-password/:token" element={<ResetPassword/>} />
                </Route>
            </Routes>
        </UserContext.Provider>
    );
}

export default App;
