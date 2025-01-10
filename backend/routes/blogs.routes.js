const express = require('express');
const { createBlog } = require('../controllers/editor');
const { verifyUser } = require('../controllers/auth');
const { getLatestBlog, getTrendingBlog, getFilteredBlog, getLatestBlogCount, getFilterBlogCount, getBlog, likeBlog, isLikedByUser, addComment, getComments } = require('../controllers/blog');
const router = express.Router();



router.post('/create-blog', verifyUser, createBlog);
router.post('/latest-blogs', getLatestBlog);
router.get('/trending-blogs', getTrendingBlog);
router.post('/search-blogs', getFilteredBlog);
router.post('/all-latest-blogs-count', getLatestBlogCount);
router.post('/search-blogs-count', getFilterBlogCount);
router.post('/get-blog', getBlog);
router.post('/like-blog', verifyUser, likeBlog);
router.post('/isliked-by-user', verifyUser, isLikedByUser);
router.post('/add-comment', verifyUser, addComment);
router.post('/get-blog-comments', getComments);

module.exports = router;