const express = require('express');
const { getSearchUsers, getUserProfile, changePassword, changeProfileImage, updateUserDetails, getNewNotifications, getNotifications, getNotificationsCount, getUserWrittenBlogs, getUserWrittenBlogsCount, deleteBlog } = require('../controllers/user');
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

router.post('/user-written-blogs', verifyUser, getUserWrittenBlogs);
router.post('/user-written-blogs-count', verifyUser, getUserWrittenBlogsCount);
router.post('/delete-blog', verifyUser, deleteBlog);

module.exports = router;