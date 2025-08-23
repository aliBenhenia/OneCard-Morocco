const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {getPayments, processPayment, getPaymentStatus, getUserOrders} = require('../controllers/orderController');

// ==================== ROUTES ====================
router.get("/",authMiddleware, getPayments)
router.post('/process', authMiddleware, processPayment);
router.get('/status/:orderId', authMiddleware, getPaymentStatus);
router.get('/orders', authMiddleware, getUserOrders);

module.exports = { router: router };
