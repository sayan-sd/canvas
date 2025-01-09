import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../../utils/uploadImage";

const uploadImageByUrl = (url) => {
    return new Promise((resolve, reject) => {
        try {
            if (!url) {
                throw new Error("URL is undefined");
            }
            resolve({
                success: 1,
                file: { url },
            });
        } catch (error) {
            reject({
                success: 0,
                message: error.message,
            });
        }
    });
};

const uploadImageByFile = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await uploadImage(file);
            
            if (result.success) {
                resolve({
                    success: 1,
                    file: {
                        url: result.url
                    }
                });
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            reject({
                success: 0,
                message: error.message || 'Failed to upload image'
            });
        }
    });
};


export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile
            }
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Enter Heading...",
            levels: [2, 3, 4],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode,
}