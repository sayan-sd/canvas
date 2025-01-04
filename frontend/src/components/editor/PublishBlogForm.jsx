import React, { useContext } from "react";
import PageAnimationWrapper from "../common/PageAnimation";
import toast from "react-hot-toast";
import { EditorContext } from "../../pages/Editor";
import Tags from "./Tags";

const PublishBlogForm = () => {
    const descCharLimit = 200;
    const tagLimit = 10;

    // blog context
    let {
        blog,
        blog: { banner, title, tags, description },
        setEditorState,
        setBlog,
    } = useContext(EditorContext);

    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    const handlerBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value });
    };

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, description: input.value });
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const handleTagsKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            let tag = e.target.value;
            tag = tag.trim();

            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag] });
                }
            } else {
                toast.error(`You can add maximum ${tagLimit} tags.`);
            }

            e.target.value = "";
        }
    };

    return (
        <PageAnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                {/* back button */}
                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                    onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                {/* Blog Preview Window */}
                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    {/* banner */}
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="Blog banner" />
                    </div>

                    {/* blog title */}
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
                        {title}
                    </h1>

                    {/* blog description */}
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
                        {description}
                    </p>
                </div>

                {/* Blog Editor form */}
                <div className="border-grey lg:border-1 lg:pl-8">
                    {/* title */}
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        className="input-box pl-4"
                        onChange={handlerBlogTitleChange}
                    />

                    {/* description */}
                    <p className="text-dark-grey mb-2 mt-9">
                        Short Description About Blog
                    </p>

                    <textarea
                        maxLength={descCharLimit}
                        defaultValue={description}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDown}
                    ></textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {descCharLimit - description.length} characters
                        remaining
                    </p>

                    {/* tags */}
                    <p className="text-dark-grey mb-2 mt-9">
                        Tags: (Used for searching and ranking your blog posts)
                    </p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topic"
                            className=" sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            onKeyDown={handleTagsKeyDown}
                        />

                        {/* tag comp */}
                        {tags.map((tag, i) => {
                            return <Tags tag={tag} key={i} />;
                        })}
                    </div>

                    {/* publish button */}
                    <button className="btn-dark px-8 mt-8">Publish</button>
                </div>
            </section>
        </PageAnimationWrapper>
    );
};

export default PublishBlogForm;