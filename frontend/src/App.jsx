import { Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<h1>Sign In</h1>} />
                <Route path="/signup" element={<h1>Sign Up</h1>} />
            </Route>
        </Routes>
    );
}

export default App;
