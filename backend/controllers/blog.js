const Blog = require("../models/Blog");

// latest blog posts
exports.getLatestBlog = async (req, res) => {
    try {
        const maxLimit = 5;
        const blogs = await Blog.find({ draft: false })
            .populate(
                "author",
                "personal_info.profile_img personal_info.username personal_info.fullname -_id"
            )
            .sort({ publishedAt: -1 })
            .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(maxLimit).exec();
        
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: "+ error.message,
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
            .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 })
            .select("blog_id title publishedAt -_id")
            .limit(5).exec();
        
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: "+ error.message,
        });
    }
}


// get filtered blogs - category,
exports.getFilteredBlog = async (req, res) => {
    let { tag } = req.body;

    let findQuery = { tags: tag, draft: false };

    let maxLimit = 5;

    try {
        const blogs = await Blog.find(findQuery)
        .populate(
            "author",
            "personal_info.profile_img personal_info.username personal_info.fullname -_id"
        )
        .sort({ publishedAt: -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
            .limit(maxLimit).exec();
        
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: "+ error.message,
        });
    }
}