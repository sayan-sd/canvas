import React from "react";
import InputBox from "../components/auth/InputBox";
import gooleIcon from "../assets/google.png";
import { Link } from "react-router-dom";
import PageAnimationWrapper from "../components/common/PageAnimation";

const userAuthForm = ({ type }) => {
    return (
        <PageAnimationWrapper keyValue={type}>
<section className="h-cover flex items-center justify-center">
            <form className="w-[80%] max-w-[400px]">
                {/* Heading */}
                <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                    {type == "sign-in" ? "Welcome back" : "Join us today"}
                </h1>

                {/* Full Name in signup */}
                {type != "sign-in" ? (
                    <InputBox
                        name={"fullname"}
                        type={"text"}
                        placeholder={"full name"}
                        icon={"user"}
                    />
                ) : (
                    ""
                )}

                {/* Email */}
                <InputBox
                    name={"emial"}
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

                {/* Button */}
                <button className="btn-dark center mt-14" type="submit">
                    {type == "sign-in" ? "Login" : "Sign Up"}
                </button>

                <div className="relative w-full items-center flex gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                {/* Google login button */}
                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                    <img src={gooleIcon} alt="Google Icon" className="w-5" />
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

export default userAuthForm;
