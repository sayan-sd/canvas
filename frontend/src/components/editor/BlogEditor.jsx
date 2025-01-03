import React, { useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import PageAnimationWrapper from "../common/PageAnimation";
import defaultBanner from "../../assets/blog banner.png";
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";

const BlogEditor = () => {
    const blogBannerRef = useRef();

    // upload blog banner preview
    const handleBannerUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error("File size must be less than 5MB");
            return;
        }

        let loadingToast = toast.loading("Uploading...");
        const result = await uploadImage(file);

        if (result.success) {
            toast.dismiss(loadingToast);
            blogBannerRef.current.src = result.url;
            toast.success("Uploaded 👍");
        }
        else {
            toast.dismiss(loadingToast);
            return toast.error("Error uploading blog banner");
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                {/* logo image */}
                <Link to={"/"} className="flex-none w-10">
                    <img src={logo} alt="Canvas Logo" />
                </Link>

                {/* blog title */}
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    New Blog
                </p>

                {/* buttons - publish & draft */}
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">Publish</button>
                    <button className="btn-light py-2">Save Draft</button>
                </div>
            </nav>

            {/* Editor */}
            <PageAnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        {/* Blog Banner */}
                        <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                            <label htmlFor="uploadBanner">
                                <img
                                    ref={blogBannerRef}
                                    className="z-20 object-cover w-full h-full cursor-alias"
                                    src={defaultBanner}
                                    alt="Blog Banner"
                                />
                                <input
                                    type="file"
                                    id="uploadBanner"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                    </div>
                </section>
            </PageAnimationWrapper>
        </>
    );
};

export default BlogEditor;
