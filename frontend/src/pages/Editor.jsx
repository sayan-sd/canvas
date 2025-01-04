import React, { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/editor/BlogEditor";
import PublishBlogForm from "../components/editor/PublishBlogForm";

const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: {personal_info: {} }
}

export const EditorContext = createContext({});

const Editor = () => {

    // editor context
    const [blog, setBlog] = useState(blogStructure);
    const [textEditor, setTextEditor] = useState({ isReady: false });

    // user context
    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth) access_token = userAuth.access_token;

    // blog status
    const [editorState, setEditorState] = useState("editor");

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? (
                    <Navigate to={"/signin"} />
                ) : editorState == "editor" ? (
                    <BlogEditor />
                ) : (
                    <PublishBlogForm />
                )
            }
        </EditorContext.Provider>
    )
};

export default Editor;
