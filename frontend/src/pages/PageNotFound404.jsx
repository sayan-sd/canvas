import React from "react";
import pageNotFoundImg from "../assets/404.png";
import { Link } from "react-router-dom";
import fullLogo from '../assets/full-logo.png'

const PageNotFound404 = () => {
    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-10 text-center">
            <img
                src={pageNotFoundImg}
                alt="404 Image"
                className="select-none w-72 aspect-square object-cover rounded"
            />
            <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-2">
                The page you are looking for does not exits. Head back to the {" "}
                <Link to={"/"} className="text-black underline">Home Page</Link>
            </p>

            <div className="mt-auto">
                <img src={fullLogo} alt="Canvas Logo" className="h-8 object-contain block mx-auto select-none" />
                <p className="mt-5 text-dark-grey">Read millions of stories around the world</p>
            </div>
        </section>
    );
};

export default PageNotFound404;
