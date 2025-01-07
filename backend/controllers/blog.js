const Blog = require("../models/Blog");

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
        let { tag, query } = req.body;

        let findQuery;

        if (tag) {
            findQuery = { tags: tag, draft: false };
        } else if (query) {
            findQuery = { draft: false, title: new RegExp(query, "i") };
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

// get filtered blogs - category, search-query
exports.getFilteredBlog = async (req, res) => {
    let { tag, query, page } = req.body;

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else if (query) {
        // only title
        // findQuery = { draft: false, title: new RegExp(query, "i") };

        // both title + tag
        findQuery = {
            draft: false,
            $or: [
                { title: new RegExp(query, "i") },
                { tags: { $in: [new RegExp(`^${query}$`, "i")] } } 
            ]
        };
    }

    let maxLimit = 2;

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
