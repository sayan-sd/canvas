process.emitWarning = () => { };

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const OTP = require("../models/Otp");

const { getAuth } = require("firebase-admin/auth");
const mailSender = require("../utils/mailSender");

const generateUserName = require("./helper/authHelper/generateUserName");
const { formatData } = require("./helper/authHelper/formatData");
const { generateOTP, generateEmailTemplate } = require("../utils/otpUtils");
const { generateForgotPasswordEmail } = require("../utils/forgotPasswordEmail");

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


// send otp to user
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
            "Your OTP Code from Canvas",
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


// verify otp and create user
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

        if (user.google_auth) {
            return res.status(403).json({
                success: false,
                message: "Try logging in with your Google account",
            });
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

        return res.status(200).json({
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


// Google Authetication (firebase)
exports.googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        if (!access_token) {
            return res.status(400).json({ message: "Token is missing" });
        }

        // get user details if token match
        const decodedUser = await getAuth().verifyIdToken(access_token);
        const { email, name} = decodedUser;

        // check user in db
        let user = await User.findOne({ "personal_info.email": email }).select(
            "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        );

        // login (user present)
        if (user) {
            // not login with google
            if (!user.google_auth) {
                return res.status(403).json({
                    success: false,
                    message:
                        "This login method is not available for the respective user.",
                });
            }

            // log in with google
            return res.status(200).json({
                success: true,
                message: "User successfully logged in",
                data: formatData(user),
            });
        }

        // Sign up new user
        const username = await generateUserName(email);
        const newUser = new User({
            personal_info: {
                fullname: name,
                email,
                username,
            },
            google_auth: true,
        });

        const savedUser = await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User successfully signed up and logged in",
            data: formatData(savedUser),
        });
    } catch (error) {
        console.error("Error in googleAuth:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


// forget password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ "personal_info.email": email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user is authenticated via Google
        if (user.google_auth) {
            return res.status(403).json({
                success: false,
                message: "Please use Google authentication to log in."
            });
        }

        // genetate random token to login
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.tokenExpiry = Date.now() + 3600000; // token valid for 1 hr
        await user.save();

        // send mail with reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await mailSender(email, "Reset Your Password for Your Canvas Account", generateForgotPasswordEmail(resetLink));
        
        res.status(200).json({ success: true, message: "Password reset link sent." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// match token and reset password
exports.resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        // check for the token
        const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        // update password
        user.personal_info.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        console.log(user.personal_info.password);
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};



// verify user token
exports.verifyUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // validate token
    if (token == null) {
        return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid token." });
        }
        req.user = user.id;
        next();
    })
}