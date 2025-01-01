import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./components/common/session";
import ResetPassword from "./components/auth/ResetPassword";

export const UserContext = createContext({});

function App() {
    const [userAuth, setUserAuth] = useState();

    useEffect(() => {
        let userInSesstion = lookInSession("user");
        userInSesstion
            ? setUserAuth(JSON.parse(userInSesstion))
            : setUserAuth({ access_token: null });
    }, []);

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
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
