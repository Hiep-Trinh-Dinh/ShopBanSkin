const express = require('express');
const router = express.Router();

const { createHistory, fetchAllHistory, deleteHistory } = require('../controllers/history-controller');

const authMiddleware = require('../middlewares/auth-middleware');

router.post('/create', authMiddleware, createHistory)
router.get('/fetch-all', authMiddleware, fetchAllHistory)
router.delete('/delete/:id', authMiddleware, deleteHistory)

module.exports = router;