const express = require('express');
const router = express.Router();

const { uploadBlogImage } = require('../controllers/editor');



router.post('/get-upload-url', uploadBlogImage);


module.exports = router;