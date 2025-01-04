const { nanoid } = require("nanoid");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Blog = require("../models/Blog");
const User = require("../models/User");

// upload blog image functionality
exports.uploadBlogImage = async (req, res) => {
    const img = req.files.banner;
    const imageData = await uploadImageToCloudinary(img);

    if (imageData) {
        return res.json({
            success: true,
            message: "Image uploaded successfully",
            uploadUrl: imageData.secure_url,
        });
    }

    return res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
};

// create blog
exports.createBlog = async (req, res) => {
    const authorId = req.user;
    let { title, des, banner, tags, content, draft } = req.body;

    // validate data
    if (!title.length) {
        return res.status(403).json({
            success: false,
            message: "Please enter a valid title",
        });
    }
    if (!draft) {
        if (
            !banner.length ||
            !tags.length ||
            !content.blocks.length
        ) {
            return res.status(403).json({
                success: false,
                message: "Please provide all required field",
            });
        }
        if (!des.length || des.length > 200) {
            return res.status(403).json({
                success: false,
                message: "Please enter a valid description",
            });
        }
    }
    

    // make tags lowercase
    tags = tags.forEach((tag) => tag.toLowerCase());

    // create a unique blog id (for later access)
    const blog_id =
        title
            .replace(/[^a-zA-Z0-9]/g, " ")
            .replace(/\s+/g, "-")
            .trim() + nanoid();

    // create blog entry
    let blog = new Blog({
        title,
        des,
        banner,
        content,
        tags,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
    });
    blog.save()
        .then((blog) => {
            let incrementVal = draft ? 0 : 1;

            // increment user's blog count
            User.findOneAndUpdate(
                { _id: authorId },
                {
                    $inc: { "account_info.total_posts": incrementVal },
                    $push: { blogs: blog._id },
                }
            )
                .then((user) => {
                    return res.status(200).json({ id: blog.blog_id });
                })
                .catch((err) => {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to update User profile",
                    });
                });
        })
        .catch((err) => {
            return res
                .status(500)
                .json({ success: false, message: err.message });
        });
};
