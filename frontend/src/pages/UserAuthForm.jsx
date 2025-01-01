import React, { useContext, useState } from "react";
import InputBox from "../components/auth/InputBox";
import gooleIcon from "../assets/google.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageAnimationWrapper from "../components/common/PageAnimation";
import toast from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../components/common/session";
import { UserContext } from "../App";
import OtpInput from "../components/auth/OtpInput";
import { authWithGoogle } from "../components/auth/Firebase";

const UserAuthForm = ({ type }) => {
    let { userAuth, setUserAuth } = useContext(UserContext);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({});
    let accessToken = userAuth?.access_token;
    const navigate = useNavigate();

    const sendOTP = async (email) => {
        try {
            await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/send-otp", {
                email,
            });
            toast.success("OTP sent to your email!");
            setOtpSent(true);
        } catch (error) {
            setShowOtpInput(false); // Hide OTP input if sending fails
            toast.error(error.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleOtpComplete = async (otp) => {
        try {
            // First verify OTP
            await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/verify-otp",
                {
                    email: formData.email,
                    otp,
                }
            );

            // Then proceed with signup
            const { data } = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/signup",
                formData
            );

            storeInSession("user", JSON.stringify(data.data));
            setUserAuth(data.data);
            toast.success("Signed up successfully!");
        } catch (error) {
            console.error("Error during verification:", error.response?.data);
            toast.error(error.response?.data?.message || "Verification failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

        // Get the form element
        const form = e.target;
        const formElements = form.elements;
        let newFormData = {};

        for (let element of formElements) {
            if (element.name) {
                newFormData[element.name] = element.value;
            }
        }

        let { fullname, email, password, otp } = newFormData;

        // Form validation for initial signup/signin
        if (!showOtpInput) {
            if (type != "sign-in") {
                if (fullname && fullname.length < 3) {
                    return toast.error(
                        "Fullname must be at least 3 characters long"
                    );
                }
            }

            if (!emailRegex.test(email)) {
                return toast.error("Invalid email address");
            }

            if (!passwordRegex.test(password)) {
                return toast.error(
                    "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                );
            }

            // For sign-in, proceed normally
            if (type === "sign-in") {
                try {
                    const { data } = await axios.post(
                        import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
                        newFormData
                    );
                    storeInSession("user", JSON.stringify(data.data));
                    setUserAuth(data.data);
                } catch (error) {
                    toast.error(
                        error.response?.data?.message || "Sign in failed"
                    );
                }
                return;
            }

            // For sign-up, show OTP input first, then send OTP
            setFormData(newFormData);
            setShowOtpInput(true);
            // Send OTP after state updates
            setTimeout(() => sendOTP(email), 0);
            return;
        }

        // Handle OTP verification
        if (showOtpInput && otp) {
            if (otp.length !== 6) {
                return toast.error("Please enter a valid 6-digit OTP");
            }
            handleOtpComplete(otp);
        }
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        try {
            const user = await authWithGoogle();
            // console.log(user)
            let serverRoute = "/google-auth";
            let formData = { access_token: user.access_token };

            const { data } = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
                formData
            );
            // console.log(data)
            storeInSession("user", JSON.stringify(data.data));
            setUserAuth(data.data);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Can't connect to Google, try another method";
            toast.error(errorMessage);
        }
    };

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        // Access the closest form and the email input field
        const form = e.target.closest("form");
        const emailInput = form?.elements["email"]; // Find the input with name="email"

        if (!emailInput || !emailInput.value) {
            return toast.error("Email is required");
        }

        const email = emailInput.value;

        // Validate email format
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Invalid email address");
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_DOMAIN}/forgot-password`,
                { email }
            );
            toast.success("Reset password link sent to your email.");
            navigate("/signin");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Error sending reset link."
            );
        }
    };

    return accessToken ? (
        <Navigate to={"/"} />
    ) : (
        <PageAnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {type == "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>

                    {!showOtpInput && (
                        <>
                            {type != "sign-in" && (
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="user"
                                />
                            )}

                            <InputBox
                                name="email"
                                type="email"
                                placeholder="Email"
                                icon="envelope"
                                disabled={showOtpInput}
                            />

                            <InputBox
                                name="password"
                                type="password"
                                placeholder="Password"
                                icon="key"
                                disabled={showOtpInput}
                            />

                            {/* forget pass */}
                            {type == "sign-in" && (
                                <p className="mt-6 text-dark-grey text-xl text-right">
                                    <button
                                        onClick={handleForgetPassword}
                                        className="underline text-black ml-1"
                                    >
                                        Forgot Password?
                                    </button>
                                </p>
                            )}
                        </>
                    )}

                    {showOtpInput && (
                        <>
                            <OtpInput name="otp" />
                            <p className="mt-2 text-sm text-dark-grey text-center">
                                Enter the OTP sent to your email
                            </p>
                        </>
                    )}

                    <button className="btn-dark center mt-14" type="submit">
                        {type == "sign-in"
                            ? "Login"
                            : showOtpInput
                            ? "Sign Up"
                            : "Send OTP"}
                    </button>

                    <div className="relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button
                        type="button"
                        className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                        onClick={handleGoogleAuth}
                    >
                        <img
                            src={gooleIcon}
                            alt="Google Icon"
                            className="w-5"
                        />
                        continue with Google
                    </button>

                    {type == "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="underline text-black ml-1"
                            >
                                Join us today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?{" "}
                            <Link
                                to="/signin"
                                className="underline text-black ml-1"
                            >
                                Login here
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </PageAnimationWrapper>
    );
};

export default UserAuthForm;
