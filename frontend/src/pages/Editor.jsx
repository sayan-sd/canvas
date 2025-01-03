import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/editor/BlogEditor";
import PublishBlogForm from "../components/editor/PublishBlogForm";

const Editor = () => {
    const { userAuth } = useContext(UserContext);
    let access_token;
    if (userAuth) access_token = userAuth.access_token;

    // blog state
    const [editorState, setEditorState] = useState("editor");

    return access_token === null ? (
        <Navigate to={"/signin"} />
    ) : editorState == "editor" ? (
        <BlogEditor />
    ) : (
        <PublishBlogForm />
    );
};

export default Editor;
