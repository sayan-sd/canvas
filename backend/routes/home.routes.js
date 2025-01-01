const express = require('express');
const router = express.Router();

const { signUp, signIn, sendOTP, verifyOTP, googleAuth, forgotPassword, resetPassword } = require('../controllers/auth');


router.post('/signup', signUp);
router.post('/signin', signIn);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.post('/google-auth', googleAuth);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;