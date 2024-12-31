const bcrypt = require('bcrypt');


const generateUserName  = require('./helper/authHelper/generateUserName');
const { formatData } = require('./helper/authHelper/formatData');

const User = require('../models/User');

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


// Sign up
exports.signUp = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validate input
        if (!fullname || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // Name validation
        if (fullname.length < 3) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "Fullname must be at least 3 characters long",
                });
        }

        // Email validation
        if (!emailRegex.test(email)) {
            return res
                .status(403)
                .json({ success: false, message: "Invalid email address" });
        }

        // check user already registered or not
        const regUser = await User.findOne({ 'personal_info.email': email });
        if (regUser) {
            return res
                .status(403)
                .json({ success: false, message: "Email already registered" });
        }


        // Password validation
        if (!passwordRegex.test(password)) {
            return res
                .status(403)
                .json({
                    success: false,
                    message:
                        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
                });
        }

        // Hash password & other data
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = await generateUserName(email);
        
        // Add data to DB
        const user = new User({
            personal_info: {
                fullname, email, password: hashedPassword, username
            }
        })
        const userData = await user.save();

        return res
            .status(200)
            .json({ success: true, message: "Sign Up successful", data: formatData(userData) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};




// Login
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
      
        // check user registration
        const user = await User.findOne({ 'personal_info.email': email });
        if (!user) {
            return res.status(403).json({ success: false, message: "User not found" });
        }

        // compare password
        const isValidPassword = await bcrypt.compare(password, user.personal_info.password);

        if (!isValidPassword) {
            return res.status(403).json({ success: false, message: "Incorrect password" });
        }

        return res.status(200).json({success: true, message: "User successfully logged in", data: formatData(user) });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: "Server Error"
        });
    }
}