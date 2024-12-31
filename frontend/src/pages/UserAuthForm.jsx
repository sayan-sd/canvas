import React, { useContext } from "react";
import InputBox from "../components/auth/InputBox";
import gooleIcon from "../assets/google.png";
import { Link, Navigate } from "react-router-dom";
import PageAnimationWrapper from "../components/common/PageAnimation";
import toast from "react-hot-toast";
import axios from "axios";
import {storeInSession} from '../components/common/session'
import { UserContext } from "../App";


const UserAuthForm = ({ type }) => {
    let { userAuth, setUserAuth } = useContext(UserContext);
    let accessToken = null;

    if (userAuth) {
        accessToken = userAuth.access_token;
    }
    
    


    const userAuthThroughServer = (serverRoute, formData) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data.data));
                setUserAuth(data.data);
            })
            .catch(({ response }) => {
                toast.error(response.data.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // form data
        let form = new FormData(formElement);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        // Form validation
        if (fullname) {
            if (fullname.length < 3) {
                return toast.error(
                    "Fullname must be at least 3 characters long"
                );
            }
        }

        // Email validation
        if (!emailRegex.test(email)) {
            return toast.error("Invalid email address");
        }

        // Password validation
        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
            );
        }

        userAuthThroughServer(serverRoute, formData);
    };

    return (
        accessToken ? <Navigate to={"/"}/> : 
        <PageAnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form id="formElement" className="w-[80%] max-w-[400px]">
                    {/* Heading */}
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {type == "sign-in" ? "Welcome back" : "Join us today"}
                    </h1>

                    {/* Full Name in signup */}
                    {type != "sign-in" ? (
                        <InputBox
                            name={"fullname"}
                            type={"text"}
                            placeholder={"Full Name"}
                            icon={"user"}
                        />
                    ) : (
                        ""
                    )}

                    {/* Email */}
                    <InputBox
                        name={"email"}
                        type={"email"}
                        placeholder={"Email"}
                        icon={"envelope"}
                    />

                    {/* Password */}
                    <InputBox
                        name={"password"}
                        type={"password"}
                        placeholder={"Password"}
                        icon={"key"}
                    />

                    {/* Submit Button */}
                    <button
                        className="btn-dark center mt-14"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        {type == "sign-in" ? "Login" : "Sign Up"}
                    </button>

                    <div className="relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>

                    {/* Google login button */}
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        <img
                            src={gooleIcon}
                            alt="Google Icon"
                            className="w-5"
                        />
                        continue with Google
                    </button>

                    {/* Redirect to login or signup */}
                    {type == "sign-in" ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account?
                            <Link
                                to={"/signup"}
                                className="underline text-black ml-1"
                            >
                                Join us today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?
                            <Link
                                to={"/signin"}
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
