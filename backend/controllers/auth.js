const bcrypt = require("bcrypt");

const generateUserName = require("./helper/authHelper/generateUserName");
const { formatData } = require("./helper/authHelper/formatData");

const User = require("../models/User");
const OTP = require("../models/Otp");
const { generateOTP, generateEmailTemplate } = require("../utils/otpUtils");
const mailSender = require("../utils/mailSender");

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            "personal_info.email": email,
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP to database
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        // Send email
        await mailSender(
            email,
            "Verify Your Email",
            generateEmailTemplate(otp)
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error sending OTP",
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the most recent OTP for this email
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        if (otp !== recentOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Update verification status
        await OTP.findByIdAndUpdate(
            recentOtp._id,
            { verified: true },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error verifying OTP",
        });
    }
};

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
            return res.status(403).json({
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
        const regUser = await User.findOne({ "personal_info.email": email });
        if (regUser) {
            return res
                .status(403)
                .json({ success: false, message: "Email already registered" });
        }

        // Password validation
        if (!passwordRegex.test(password)) {
            return res.status(403).json({
                success: false,
                message:
                    "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
            });
        }

        // Check for verified OTP
        const recentOtp = await OTP.findOne({
            email,
            verified: true,
        }).sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        // Log for debugging
        // console.log("Found OTP:", recentOtp);

        // Hash password & other data
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = await generateUserName(email);

        // Add data to DB
        const user = new User({
            personal_info: {
                fullname,
                email,
                password: hashedPassword,
                username,
            },
        });
        const userData = await user.save();

        // Delete the OTP document after successful signup
        await OTP.deleteOne({ _id: recentOtp._id });

        return res.status(200).json({
            success: true,
            message: "Sign Up successful",
            data: formatData(userData),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Login
exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user registration
        const user = await User.findOne({ "personal_info.email": email });
        if (!user) {
            return res
                .status(403)
                .json({ success: false, message: "User not found" });
        }

        // compare password
        const isValidPassword = await bcrypt.compare(
            password,
            user.personal_info.password
        );

        if (!isValidPassword) {
            return res
                .status(403)
                .json({ success: false, message: "Incorrect password" });
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "User successfully logged in",
                data: formatData(user),
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
