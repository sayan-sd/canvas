const express = require('express');
const router = express.Router();
const { signUp, signIn, sendOTP, verifyOTP, googleAuth } = require('../controllers/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/google-auth', googleAuth);

module.exports = router;