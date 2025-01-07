const express = require('express');
const { getSearchUsers } = require('../controllers/user');
const router = express.Router();


router.post("/search-users", getSearchUsers);

module.exports = router;