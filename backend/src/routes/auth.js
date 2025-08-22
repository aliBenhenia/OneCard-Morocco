const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/signup', authController.validateSignup, authController.signup);
router.post('/login', authController.validateLogin, authController.login);

module.exports = router;
