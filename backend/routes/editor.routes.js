const express = require('express');
const router = express.Router();

const { uploadBlogBanner } = require('../controllers/editor');



router.post('/get-upload-url', uploadBlogBanner);


module.exports = router;