const express = require('express');
const { handleEmail } = require('../controllers/emailController');

const router = express.Router();

router.post('/send-email', handleEmail);

module.exports = router;
