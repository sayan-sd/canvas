import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import BlogEditor from "../components/editor/BlogEditor";
import PublishBlogForm from "../components/editor/PublishBlogForm";
import Loader from "../components/common/Loader";
import axios from "axios";
import toast from 'react-hot-toast'

const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
    // edit blog
    const { blog_id } = useParams();
    const navigate = useNavigate();

    // editor context
    const [blog, setBlog] = useState(blogStructure);
    const [textEditor, setTextEditor] = useState({ isReady: false });
    const [editorState, setEditorState] = useState("editor");
    const [loading, setLoading] = useState(true);

    // user context
    const { userAuth } = useContext(UserContext);
    let access_token, username;
    if (userAuth != null && userAuth.username != undefined) {
        access_token = userAuth.access_token;
        username = userAuth.username;
    };


    useEffect(() => {
        if (!blog_id) {
            return setLoading(false);
        }

        // get blog from server for edit
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/blogs/get-blog", {
                blog_id,
                draft: true,
                mode: "edit",
            })
            .then(({ data }) => {
                const blog = data.blog;

                // check if the blog by the authenticated user or not
                if (blog.author.personal_info.username != username) {
                    toast.error("You are not allowed to edit this blog!");
                    return navigate(`/blog/${blog_id}`);
                }

                setBlog(blog);
                setLoading(false);
            })
            .catch((err) => {
                setBlog(null);
                setLoading(false);
            });
    }, []);

    return (
        <EditorContext.Provider
            value={{
                blog,
                setBlog,
                editorState,
                setEditorState,
                textEditor,
                setTextEditor,
            }}
        >
            {access_token === null ? (
                <Navigate to={"/signin"} />
            ) : loading ? (
                <Loader />
            ) : editorState == "editor" ? (
                <BlogEditor />
            ) : (
                <PublishBlogForm />
            )}
        </EditorContext.Provider>
    );
};

export default Editor;
