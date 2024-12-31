import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import UserAuthForm from './pages/UserAuthForm'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<UserAuthForm type= {"sign-in"}/>} />
                <Route path="/signup" element={<UserAuthForm type={"sign-up"} />} />
            </Route>
        </Routes>
    );
}

export default App;
