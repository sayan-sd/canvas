const User = require("../models/User");

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
    }
    catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Server Error: " + error.message,
            });
    }
};
