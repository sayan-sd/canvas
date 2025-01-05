const express = require('express');
const { createBlog } = require('../controllers/editor');
const { verifyUser } = require('../controllers/auth');
const { getLatestBlog, getTrendingBlog, getFilteredBlog } = require('../controllers/blog');
const router = express.Router();





router.post('/create-blog', verifyUser, createBlog);
router.get('/latest-blogs', getLatestBlog);
router.get('/trending-blogs', getTrendingBlog);
router.post('/search-blogs', getFilteredBlog);


module.exports = router;