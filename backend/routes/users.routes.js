const express = require('express');
const { getSearchUsers, getUserProfile, changePassword, changeProfileImage, updateUserDetails, getNewNotifications, getNotifications, getNotificationsCount } = require('../controllers/user');
const { verifyUser } = require('../controllers/auth');
const router = express.Router();


router.post("/search-users", getSearchUsers);
router.post("/get-profile", getUserProfile);

router.post('/change-password', verifyUser, changePassword);
router.post('/update-profile-img', verifyUser, changeProfileImage);
router.post('/update-profile', verifyUser, updateUserDetails);

router.get('/new-notifications', verifyUser, getNewNotifications);
router.post('/notifications', verifyUser, getNotifications);
router.post('/all-notifications-count', verifyUser, getNotificationsCount);

module.exports = router;