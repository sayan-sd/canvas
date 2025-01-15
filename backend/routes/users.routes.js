const express = require('express');
const { getSearchUsers, getUserProfile, changePassword, changeProfileImage, updateUserDetails } = require('../controllers/user');
const { verifyUser } = require('../controllers/auth');
const router = express.Router();


router.post("/search-users", getSearchUsers);
router.post("/get-profile", getUserProfile);

router.post('/change-password', verifyUser, changePassword);
router.post('/update-profile-img', verifyUser, changeProfileImage);
router.post('/update-profile', verifyUser, updateUserDetails);

module.exports = router;