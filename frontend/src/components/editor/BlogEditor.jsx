import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../../assets/logo-light.png";
import darkLogo from "../../assets/logo-dark.png";
import PageAnimationWrapper from "../common/PageAnimation";
import lightBanner from "../../assets/blog banner light.png"
import darkBanner from "../../assets/blog banner dark.png"
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { EditorContext } from "../../pages/Editor";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./BlogTools";
import axios from "axios";
import { ThemeContext, UserContext } from "../../App";

const BlogEditor = () => {
    // blog context
    let {
        blog,
        blog: { title, banner, content, tags, des },
        setBlog,
        textEditor,
        setTextEditor,
        setEditorState,
    } = useContext(EditorContext);

    let { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth != null) {
        access_token = userAuth.access_token;
    }

    let { theme } = useContext(ThemeContext);

    let { blog_id } = useParams();

    const navigate = useNavigate();

    // create editor
    useEffect(() => {
        // if (!textEditor.isReady) {
            setTextEditor(
                new EditorJS({
                    holder: "textEditor",
                    data: Array.isArray(content) ? content[0] : content,
                    tools: tools,
                    placeholder: "Let's write an awesome story...",
                })
            );
        // }
    }, []);

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
            setBlog({ ...blog, banner: result.url });
            toast.success("Uploaded 👍");
        } else {
            toast.dismiss(loadingToast);
            return toast.error("Error uploading blog banner");
        }
    };

    // prevent multi line title
    const handleTitleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    // chnage textarea height dynamically
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = "auto";
        input.style.height = `${input.scrollHeight}px`;

        setBlog({ ...blog, title: input.value });
    };

    // default banner - shwo default banner
    const handleError = (e) => {
        let img = e.target;
        // console.log(img);
        
        // Add a small timeout to ensure proper handling of the image state
        setTimeout(() => {
            if (!img.complete || img.naturalHeight === 0) {
                img.src = theme ==  'light' ? lightBanner : darkBanner;
            }
        }, 50);
    };

    // on publish button click
    const handlePublishEvent = () => {
        // === validate data ===
        // must have a blog banner
        if (!banner.length) {
            toast.error("Please upload a blog banner");
            return;
        }

        // must have a title
        if (!title.length) {
            toast.error("Please enter a blog title");
            return;
        }

        // must have content
        if (textEditor.isReady) {
            textEditor
                .save()
                .then((data) => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data });
                        setEditorState("publish");
                    } else {
                        toast.error("Please write some content");
                    }
                })
                .catch((err) => {
                    toast.error("Error saving blog content");
                });
        }
    };

    // save blog as draft
    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        // validate data
        if (!title) {
            return toast.error("Write a title to save it as draft");
        }

        // send data to server
        let loadingToast = toast.loading("Saving as draft...");
        e.target.classList.add("disable");

        if (textEditor.isReady) {
            textEditor.save().then((content) => {
                const blogObj = {
                    title,
                    banner,
                    des,
                    tags,
                    content,
                    draft: true,
                };

                axios
                    .post(
                        import.meta.env.VITE_SERVER_DOMAIN +
                            "/blogs/create-blog",
                        {...blogObj, id: blog_id},
                        {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                        }
                    )
                    .then(() => {
                        e.target.classList.remove("disable");
                        toast.dismiss(loadingToast);
                        toast.success("Saved as Draft 👍");

                        setTimeout(() => {
                            navigate("/dashboard/blogs?tab=draft");
                        }, 500);
                    })
                    .catch(({ response }) => {
                        e.target.classList.remove("disable");
                        toast.dismiss(loadingToast);

                        return toast.error(response.data.message);
                    });
            });
        }
    };

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                {/* logo image */}
                <Link to={"/"} className="flex-none w-10">
                    <img src={theme == 'light' ? lightLogo : darkLogo} alt="Canvas Logo" />
                </Link>

                {/* blog title */}
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>

                {/* buttons - publish & draft */}
                <div className="flex gap-4 ml-auto">
                    <button
                        className="btn-dark py-2"
                        onClick={handlePublishEvent}
                    >
                        Publish
                    </button>
                    <button
                        className="btn-light py-2"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
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
                                    className="z-20 object-cover w-full h-full cursor-alias"
                                    src={blog ? banner : ""}
                                    alt="Blog Banner"
                                    onError={handleError}
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

                        {/* Blog title */}
                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        {/* Blog content */}
                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </PageAnimationWrapper>
        </>
    );
};

export default BlogEditor;
