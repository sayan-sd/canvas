import React, { useContext } from "react";
import { EditorContext } from "../../pages/Editor";

const Tags = ({ tag }) => {
    let {
        blog,
        blog: { tags },
        setBlog,
    } = useContext(EditorContext);

    const handleTagDelete = () => {
        tags = tags.filter((t) => t != tag);
        setBlog({ ...blog, tags });
    };

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            <p className="outline-none">{tag}</p>
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    );
};

export default Tags;