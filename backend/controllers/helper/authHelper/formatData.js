const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.formatData = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return {
        access_token: accessToken,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}