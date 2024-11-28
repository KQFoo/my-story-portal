const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Route to create a new post
router.post("/create", postController.createPost);

// Route to filter posts by date
router.get('/filter', postController.filterPostsByDate);

// Route to display a single post
// router.get('/:id', postController.getPost);

router.post('/:post_id/increment-views', postController.incrementViews);

module.exports = router;