const express = require('express');
const { getSearchUsers, getUserProfile } = require('../controllers/user');
const router = express.Router();


router.post("/search-users", getSearchUsers);
router.post("/get-profile", getUserProfile);

module.exports = router;