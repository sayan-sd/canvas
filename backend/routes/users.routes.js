const express = require('express');
const { getSearchUsers, getUserProfile, changePassword } = require('../controllers/user');
const { verifyUser } = require('../controllers/auth');
const router = express.Router();


router.post("/search-users", getSearchUsers);
router.post("/get-profile", getUserProfile);

router.post('/change-password', verifyUser, changePassword);

module.exports = router;