const {Payment, Order} = require('../models/Order');
// ==================== CONTROLLERS ====================

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const processPayment = async (req, res) => {
  try {
    const { billingInfo, cardInfo, paymentMethod, amount, cartItems, tax } = req.body;
    const user = req.user;
    console.log("=====> ",user);

    if (!billingInfo || !paymentMethod || !amount || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: 'Missing required payment information' });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    const payment = new Payment({
      userId: user || null,
      orderId,
      amount,
      paymentMethod,
      billingInfo,
      cardInfo: cardInfo ? {
        last4: cardInfo.cardNumber ? cardInfo.cardNumber.slice(-4) : '',
        brand: cardInfo.cardNumber ? getCardBrand(cardInfo.cardNumber) : 'Unknown',
        expiryMonth: cardInfo.expiryDate ? cardInfo.expiryDate.split('/')[0] : '',
        expiryYear: cardInfo.expiryDate ? cardInfo.expiryDate.split('/')[1] : ''
      } : undefined,
      status: 'processing'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      payment.status = 'completed';
      await payment.save();

      const order = new Order({
        userId: user || null,
        orderId,
        items: cartItems.map(item => ({
          // productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category
        })),
        totalAmount: amount,
        tax: tax || 0,
        paymentId: payment._id,
        billingInfo,
        status: 'processing'
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        orderId: payment.orderId,
        paymentId: payment._id
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      res.status(400).json({ success: false, message: 'Payment declined. Please try a different payment method.' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during payment processing' });
  }
};

// Helper function to determine card brand
const getCardBrand = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  return 'Unknown';
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      payment: {
        orderId: payment.orderId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    // const { user } = req.query;

    // if (!user) {
    //   return res.status(400).json({ success: false, message: 'User ID is required' });
    // }
    const user = req.user;

    const orders = await Order.find({ userId: user }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getPayments,
  processPayment,
  getPaymentStatus,
  getUserOrders
};