const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middlewares/rateLimiter'); 

// Routes pour l'authentification
//router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.get('/verify-token', authController.verifyToken);

module.exports = router;
