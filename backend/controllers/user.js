const User = require("../models/User");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
const bcrypt = require("bcrypt");

// search matched users
exports.getSearchUsers = async (req, res) => {
    let { query } = req.body;

    try {
        const users = await User.find({
            "personal_info.username": new RegExp(query, "i"),
        })
            .limit(50)
            .select(
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .exec();

        if (!users) {
            return res
                .status(404)
                .json({ success: false, message: "No users found" });
        }

        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// get specific profile
exports.getUserProfile = async (req, res) => {
    try {
        let { username } = req.body;

        const user = await User.findOne({ "personal_info.username": username })
            .select("-personal_info.password -google_auth -updatedAt")
            .exec();

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// change password
exports.changePassword = async (req, res) => {
    let { currentPassword, newPassword } = req.body;

    // validate data
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!passwordRegex.test(newPassword)) {
        return res.status(403).json({
            message: "New password is invalid",
        });
    }

    try {
        // find the user
        let user = await User.findOne({ _id: req.user });

        // check if it is authenticated by google
        if (user.google_auth) {
            return res.status(403).json({
                message:
                    "You can't change your password because you logged in through Google account",
            });
        }

        // check if current password is correct
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.personal_info.password
        );
        if (!isMatch) {
            return res
                .status(403)
                .json({ message: "Incorrect current password" });
        }

        // update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.personal_info.password = hashedPassword;
        await user.save();

        return res
            .status(200)
            .json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
};

// change profile image
exports.changeProfileImage = async (req, res) => {
    let { url } = req.body;

    // find image and update
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.user },
            { "personal_info.profile_img": url },
            { new: true }
        );
        return res.status(200).json({
            message: "Profile image updated successfully",
            profile_img: user.personal_info.profile_img,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
};

// update user details
exports.updateUserDetails = async (req, res) => {
    let bioLimit = 200;
    let { fullname, username, bio, social_links } = req.body;

    // validate data
    if (fullname.length < 3 || username.length < 3 || bio.length > bioLimit) {
        return res.status(400).json({ message: "Invalid data" });
    }
    let socialLinksArr = Object.keys(social_links);

    try {
        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]])
                    .hostname;

                if (
                    !hostname.includes(`${socialLinksArr[i]}.com`) &&
                    socialLinksArr[i] != "website"
                ) {
                    return res
                        .status(400)
                        .json({ message: "Invalid social link" });
                }
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: "Provide your complete social links in http(s):// format",
        });
    }

    // update user profile
    let updateObj = {
        "personal_info.fullname": fullname,
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links,
    };

    try {
        let user = await User.findOneAndUpdate({ _id: req.user }, updateObj, {
            runValidators: true,
            new: true,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res
            .status(200)
            .json({ message: "Profile updated successfully", username });
    } catch (error) {
        if (error.code == 11000) {
            return res.status(403).json({ message: "Username already exists" });
        }
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
};

// get new Notification - dot
exports.getNewNotifications = async (req, res) => {
    let user_id = req.user;

    try {
        const result = await Notification.exists({
            notification_for: user_id,
            seen: false,
            user: { $ne: user_id },
        });
        if (result != null) {
            return res.status(200).json({ new_notification_available: true });
        } else {
            return res.status(200).json({ new_notification_available: false });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error: " + error.message,
        });
    }
};

// get notifications
exports.getNotifications = async (req, res) => {
    let user_id = req.user;
    let { page, filter, deletedDocCount } = req.body;
    const maxLimit = 10;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } };
    let skipDocs = (page - 1) * maxLimit;
    if (filter != "all") {
        findQuery.type = filter;
    }
    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }

    Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("blog", "title blog_id")
        .populate(
            "user",
            "personal_info.fullname personal_info.username personal_info.profile_img"
        )
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .sort({ createdAt: -1 })
        .select("createdAt type seen reply")
        .then((notifications) => {
            Notification.updateMany(findQuery, { seen: true })
                .skip(skipDocs)
                .limit(maxLimit)
                .then((notificationSeen) => {});
            return res.status(200).json({ notifications });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: "Server Error: " + error.message,
            });
        });
};

// get notifications count
exports.getNotificationsCount = async (req, res) => {
    let user_id = req.user;
    let { filter } = req.body;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } };
    if (filter != "all") {
        findQuery.type = filter;
    }

    Notification.countDocuments(findQuery)
        .then((count) => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message: "Server Error: " + error.message,
            });
        });
};

// all user writtten blogs
exports.getUserWrittenBlogs = async (req, res) => {
    let user_id = req.user;
    let { page, draft, query, deletedDocCount, totalDocs } = req.body;

    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;
    if (deletedDocCount) {
        skipDocs -= deletedDocCount;
    }

    Blog.find({ author: user_id, draft, title: new RegExp(query, "i") })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 })
        .select(" title banner publishedAt blog_id activity des draft -_id ")
        .then((blogs) => {
            return res.status(200).json({ blogs });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ message: "Server Error: " + error.message });
        });
};

// user written blogs count
exports.getUserWrittenBlogsCount = async (req, res) => {
    let user_id = req.user;
    let { draft, query } = req.body;
    Blog.countDocuments({
        author: user_id,
        draft,
        title: new RegExp(query, "i"),
    })
        .then((count) => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ message: "Server Error: " + error.message });
        });
};

// delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const user_id = req.user;
        const { blog_id } = req.body;

        if (!blog_id) {
            return res.status(400).json({ message: "Blog ID is required" });
        }

        // First find the blog to make sure it exists and to get its _id
        const blog = await Blog.findOne({ blog_id });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Delete the blog and related data in parallel
        await Promise.all([
            // Delete the blog
            Blog.findOneAndDelete({ blog_id }),

            // Delete related notifications
            Notification.deleteMany({ blog: blog._id }),

            // Delete related comments
            Comment.deleteMany({ blog_id: blog._id }),

            // Update user
            User.findOneAndUpdate(
                { _id: user_id },
                {
                    $pull: { blogs: blog._id },
                    $inc: { "account_info.total_posts": -1 },
                }
            ),
        ]);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (err) {
        console.error("Delete blog error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting blog",
            error: err.message,
        });
    }
};

// Get top 3 user with max read count
exports.getWhomeToFollow = async (req, res) => {
    const maxLimit = 3;
    try {
        const users = await User.find()
            .sort({ "account_info.total_reads": -1 })
            .limit(maxLimit)
            .select(
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            );
        res.json(users);
    } catch (err) {
        console.error("Get top 3 users error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching top 3 users",
            error: err.message,
        });
    }
};


// Toggle Bookmarks
exports.toggleBookmark = async (req, res) => {
    const { blog_id } = req.body;
    const user_id = req.user;

    try {
        // Find the blog to get its _id
        const blog = await Blog.findOne({ blog_id });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Find user and check if blog is already bookmarked
        const user = await User.findById(user_id);
        const isBookmarked = user.bookmarks.includes(blog._id);

        // Update user's bookmarks
        if (isBookmarked) {
            await User.findByIdAndUpdate(user_id, {
                $pull: { bookmarks: blog._id }
            });
        } else {
            await User.findByIdAndUpdate(user_id, {
                $addToSet: { bookmarks: blog._id }
            });
        }

        return res.status(200).json({
            message: isBookmarked ? "Remove from your reading list" : "Added to your reading list",
            isBookmarked: !isBookmarked
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message
        });
    }
};


// All bookmarked blogs
exports.getBookmarkedBlogs = async (req, res) => {
    const user_id = req.user;
    
    try {
        const user = await User.findById(user_id)
            .populate({
                path: 'bookmarks',
                match: { draft: false },
                options: {
                    sort: { publishedAt: -1 }
                },
                select: '-content -_id',
                populate: {
                    path: 'author', 
                    select: 'personal_info.profile_img personal_info.username personal_info.fullname -_id' 
                }
            })
            .select('bookmarks -_id');

        const totalDocs = await User.findById(user_id)
            .then(user => user.bookmarks.length);

        return res.status(200).json({
            blogs: user.bookmarks,
            totalDocs
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message
        });
    }
};