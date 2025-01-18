import React, { useContext } from "react";
import lightPageNotFoundImg from "../assets/404-light.png";
import darkPageNotFoundImg from "../assets/404-dark.png";
import { Link } from "react-router-dom";
import lightFullLogo from "../assets/full-logo-light.png";
import darkFullLogo from "../assets/full-logo-dark.png";
import { ThemeContext } from "../App";

const PageNotFound404 = () => {
    let { theme } = useContext(ThemeContext);

    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-10 text-center">
            <img
                src={
                    theme == "light"
                        ? darkPageNotFoundImg
                        : lightPageNotFoundImg
                }
                alt="404 Image"
                className="select-none w-72 aspect-square object-cover rounded"
            />
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-2">
                The page you are looking for does not exits. Head back to the{" "}
                <Link to={"/"} className="text-black underline">
                    Home Page
                </Link>
            </p>

            <div className="mt-auto">
                <img
                    src={theme == "light" ? lightFullLogo : darkFullLogo}
                    alt="Canvas Logo"
                    className="h-8 object-contain block mx-auto select-none"
                />
                <p className="mt-5 text-dark-grey">
                    Read millions of stories around the world
                </p>
            </div>
        </section>
    );
};

export default PageNotFound404;
