const User = require('../../../models/User');

const generateUserName = async (email) => {
    try {
        const { nanoid } = await import('nanoid');
        let username = email.split("@")[0];

        let isUsernameUnique = await User.exists({
            "personal_info.username": username,
        });

        if (!isUsernameUnique) return username;
        else {
            return username += nanoid().substring(0, 5);
        }
    } catch (error) { 
        console.log(error);
    }
};

module.exports = generateUserName;
