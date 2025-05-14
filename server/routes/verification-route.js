const express = require('express');
const router = express.Router();

const {verifyEmail, sendCodeAgain, sendCode} = require('../controllers/verification-controller')

router.post('/verify-code', verifyEmail)
router.post('/send-code', sendCode)
router.get('/send-again', sendCodeAgain)


module.exports = router;