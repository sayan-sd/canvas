const express = require('express');
const router = express.Router();
const { signUp, signIn, sendOTP, verifyOTP } = require('../controllers/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;