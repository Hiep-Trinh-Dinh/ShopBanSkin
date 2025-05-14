const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload-middleware'); // Import middleware upload

const { createPost, fetchAllPosts, fetchDetailPost, editPost, deletePost } = require('../controllers/post-controller');

// Sử dụng upload middleware cho route tạo post
router.post('/create', upload.single('image'), createPost); 
router.get('/fetch-all', fetchAllPosts);
router.get('/fetch-detail/:id', fetchDetailPost);
router.put('/edit/:id', upload.single('image'), editPost);
router.delete('/delete/:id', deletePost);

module.exports = router;