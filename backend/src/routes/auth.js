const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Routes
router.post('/signup', authController.validateSignup, authController.signup);
router.post('/login', authController.validateLogin, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
