const express = require('express');
const { createBlog } = require('../controllers/editor');
const { verifyUser } = require('../controllers/auth');
const router = express.Router();





router.post('/create-blog', verifyUser, createBlog);


module.exports = router;