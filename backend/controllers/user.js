const User = require("../models/User");
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
const bcrypt = require('bcrypt')


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
                message: "You can't change your password because you logged in through Google account"
            });
        }

        // check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.personal_info.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Incorrect current password" });
        }
        
        // update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.personal_info.password = hashedPassword;
        await user.save();
        
        return res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
}


// change profile image
exports.changeProfileImage = async (req, res) => {
    let { url } = req.body;

    // find image and update
    try {
        let user = await User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url }, {new: true});
        return res.status(200).json({ message: "Profile image updated successfully", profile_img: user.personal_info.profile_img });
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
}


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
        for (let i = 0; i < socialLinksArr.length; i++){
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                    return res.status(400).json({ message: "Invalid social link" });
                }
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Provide your complete social links in http(s):// format"
        });
    }

    // update user profile
    let updateObj = {
        "personal_info.fullname": fullname,
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    try {
        let user = await User.findOneAndUpdate({ _id: req.user }, updateObj, {
            runValidators: true,
            new: true
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated successfully", username });
    }
    catch (error) {
        if (error.code == 11000) {
            return res.status(403).json({ message: "Username already exists" });
        }
        return res.status(500).json({
            message: "Server Error: " + error.message,
        });
    }
}