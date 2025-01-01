import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "./InputBox";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/reset-password`,
                { password, token }
            );
            toast.success("Password reset successfully.");
            navigate("/signin");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error resetting password."
            );
        }
    };

    return (
        <section className="h-cover flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                    Reset Password
                </h1>
                <InputBox
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    icon="key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="btn-dark center mt-6" type="submit">
                    Reset Password
                </button>
            </form>
        </section>
    );
};

export default ResetPassword;
