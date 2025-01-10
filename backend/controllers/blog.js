const Blog = require("../models/Blog");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Comment = require("../models/Comment");

// latest blog posts
exports.getLatestBlog = async (req, res) => {
    let { page } = req.body;

    try {
        const maxLimit = 5;
        const blogs = await Blog.find({ draft: false })
            .populate(
                "author",
                "personal_info.profile_img personal_info.username personal_info.fullname -_id"
            )
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit)
            .exec();

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "No blog found",
            });
        }

        return res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// latest blog count
exports.getLatestBlogCount = async (req, res) => {
    try {
        const count = await Blog.countDocuments({ draft: false });
        if (count.length < 0) {
            return res.status(404).json({
                success: false,
                message: "No blog found",
            });
        }

        return res.status(200).json({
            success: true,
            totalDocs: count,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// blog count by applicable filter
exports.getFilterBlogCount = async (req, res) => {
    try {
        let { tag, author, query } = req.body;

        let findQuery;

        if (tag) {
            findQuery = { tags: tag, draft: false };
        } else if (query) {
            // only title
            // findQuery = { draft: false, title: new RegExp(query, "i") };

            // both title + tag
            findQuery = {
                draft: false,
                $or: [
                    { title: new RegExp(query, "i") },
                    { tags: { $in: [new RegExp(`^${query}$`, "i")] } },
                ],
            };
        } else if (author) {
            findQuery = { author, draft: false };
        }

        const count = await Blog.countDocuments(findQuery);
        if (count.length < 0) {
            return res.status(404).json({
                success: false,
                message: "No blog found",
            });
        }

        return res.status(200).json({
            success: true,
            totalDocs: count,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// trending blog posts
exports.getTrendingBlog = async (req, res) => {
    try {
        const blogs = await Blog.find({ draft: false })
            .populate(
                "author",
                "personal_info.profile_img personal_info.username personal_info.fullname -_id"
            )
            .sort({
                "activity.total_reads": -1,
                "activity.total_likes": -1,
                publishedAt: -1,
            })
            .select("blog_id title publishedAt -_id")
            .limit(5)
            .exec();

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "No blog found",
            });
        }

        return res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// get filtered blogs - category, search-query, similar(tag, limit),
exports.getFilteredBlog = async (req, res) => {
    let { tag, query, author, page, limit, eliminate_blog } = req.body;

    let findQuery;

    if (tag) {
        findQuery = {
            tags: tag,
            draft: false,
            blog_id: { $ne: eliminate_blog },
        };
    } else if (query) {
        // only title
        // findQuery = { draft: false, title: new RegExp(query, "i") };

        // both title + tag
        findQuery = {
            draft: false,
            $or: [
                { title: new RegExp(query, "i") },
                { tags: { $in: [new RegExp(`^${query}$`, "i")] } },
            ],
        };
    } else if (author) {
        findQuery = { author, draft: false };
    }

    let maxLimit = limit || 2;

    try {
        const blogs = await Blog.find(findQuery)
            .populate(
                "author",
                "personal_info.profile_img personal_info.username personal_info.fullname -_id"
            )
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit)
            .exec();

        if (!blogs) {
            return res.status(404).json({
                success: false,
                message: "No blog found for this tag",
            });
        }

        return res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// get one specific blog
exports.getBlog = async (req, res) => {
    try {
        const { blog_id, draft, mode } = req.body;

        // increment read count if user dont edit the blog
        let incrementVal = mode != "edit" ? 1 : 0;

        const blog = await Blog.findOneAndUpdate(
            { blog_id },
            { $inc: { "activity.total_reads": incrementVal } },
            { new: true }
        )
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img"
            )
            .select(
                "title des content banner activity publishedAt blog_id tags"
            )
            .exec();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "No blog found for this URL",
            });
        }

        // update user read count
        User.findOneAndUpdate(
            { "personal_info.username": blog.author.personal_info.username },
            { $inc: { "account_info.total_reads": incrementVal } }
        ).catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Failed to update user read count",
            });
        });

        // want to access a draft blog for reading
        if (blog.draft && !draft) {
            return res.status(403).json({
                success: false,
                message: "You can't access a draft blogs",
            });
        }

        return res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// like blog
exports.likeBlog = async (req, res) => {
    try {
        let user_id = req.user;
        const { _id, isLikedByUser } = req.body;

        // If user is liking, increment by 1. If disliking, decrement by 1
        let incrementVal = !isLikedByUser ? 1 : -1;

        // First check if the notification/like exists
        const existingLike = await Notification.findOne({
            user: user_id,
            blog: _id,
            type: "like",
        });

        // Validate the like/dislike action
        if (!isLikedByUser && existingLike) {
            return res.status(400).json({
                success: false,
                message: "Blog already liked",
            });
        }

        if (isLikedByUser && !existingLike) {
            return res.status(400).json({
                success: false,
                message: "Blog not previously liked",
            });
        }

        // Update blog like count
        const blog = await Blog.findOneAndUpdate(
            { _id },
            { $inc: { "activity.total_likes": incrementVal } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "No blog found",
            });
        }

        // Handle like/dislike
        if (!isLikedByUser) {
            // Adding like
            const notification = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id,
            });
            await notification.save();
            return res.status(200).json({ liked_by_user: true });
        } else {
            // Removing like
            await Notification.findOneAndDelete({
                user: user_id,
                blog: _id,
                type: "like",
            });
            return res.status(200).json({ liked_by_user: false });
        }
    } catch (err) {
        console.error("Like error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update blog like count",
            error: err.message,
        });
    }
};

// is already liked by user
exports.isLikedByUser = async (req, res) => {
    try {
        let user_id = req.user;
        const { _id } = req.body;

        const result = await Notification.exists({
            user: user_id,
            type: "like",
            blog: _id,
        });

        if (!result) {
            return res.status(200).json({ liked_by_user: false });
        }
        return res.status(200).json({ liked_by_user: true });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to check if user liked the blog",
            err,
        });
    }
};

// comment on blog
exports.addComment = async (req, res) => {
    let user_id = req.user;

    let { _id, comment, blog_author, replying_to } = req.body;

    // validate comment
    if (!comment.length) {
        return res.status(400).json({
            success: false,
            message: "Comment must not be empty",
        });
    }

    // creating comment instance
    let commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
    };

    // check if it is a reply
    if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(async (commentFile) => {
        // update blog
        let { comment, commentedAt, children } = commentFile;

        Blog.findOneAndUpdate(
            { _id },
            {
                $push: { comments: commentFile._id },
                $inc: {
                    "activity.total_comments": 1,
                    "activity.total_parent_comments": replying_to ? 0 : 1,
                },
            }
        ).then((blog) => {});

        // creating notification for blog author
        let notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id,
        };

        if (replying_to) {
            notificationObj.replied_on_comment = replying_to;
            await Comment.findOneAndUpdate(
                { _id: replying_to },
                { $push: { children: commentFile._id } }
            ).then((replyingToCommentDoc) => {
                notificationObj.notification_for =
                    replyingToCommentDoc.commented_by;
            });
        }

        new Notification(notificationObj).save().then((notification) => {});

        return res.status(200).json({
            comment,
            commentedAt,
            _id: commentFile._id,
            user_id,
            children,
        });
    });
};

// get all comments for a blog
exports.getComments = async (req, res) => {
    let { blog_id, skip } = req.body;

    let maxLimit = 5;

    Comment.find({ blog_id, isReply: false })
        .populate(
            "commented_by",
            "personal_info.username, personal_info.fullname personal_info.profile_img"
        )
        .skip(skip)
        .limit(maxLimit)
        .sort({ commentedAt: -1 })
        .then((comment) => {
            res.status(200).json(comment);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to get comments",
            });
        });
};

// get all replies for a comment
exports.getReplies = async (req, res) => {
    let { _id, skip } = req.body;
    let maxLimit = 5;
    Comment.findOne({ _id })
        .populate({
            path: "children",
            option: {
                skip: skip,
                limit: maxLimit,
                sort: { 'commentedAt': -1 },
            },
            populate: {
                path: "commented_by",
                select: "personal_info.username personal_info.fullname personal_info.profile_img",
            },
            select: "-blog_id -updatedAt",
        })
        .select("children")
        .then((doc) => {
            res.status(200).json({ replies: doc.children });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Failed to get replies",
            });
        });
};
