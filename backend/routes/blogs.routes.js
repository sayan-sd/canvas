const express = require('express');
const { createBlog } = require('../controllers/editor');
const { verifyUser } = require('../controllers/auth');
const { getLatestBlog, getTrendingBlog, getFilteredBlog, getLatestBlogCount, getFilterBlogCount } = require('../controllers/blog');
const router = express.Router();



router.post('/create-blog', verifyUser, createBlog);
router.post('/latest-blogs', getLatestBlog);
router.get('/trending-blogs', getTrendingBlog);
router.post('/search-blogs', getFilteredBlog);
router.post('/all-latest-blogs-count', getLatestBlogCount);
router.post('/search-blogs-count', getFilterBlogCount);


module.exports = router;