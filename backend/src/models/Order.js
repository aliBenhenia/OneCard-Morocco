const mongoose = require('mongoose');

// ==================== SCHEMAS ====================
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending','processing','completed','failed','refunded'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  billingInfo: { email: String, address: String, city: String, zipCode: String, country: String },
  cardInfo: { last4: String, brand: String, expiryMonth: String, expiryYear: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  orderId: { type: String, required: true, unique: true },
  items: [{
    // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String
  }],
  totalAmount: { type: Number, required: true },
  tax: { type: Number, required: true },
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  billingInfo: { email: String, address: String, city: String, zipCode: String, country: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Payment, Order };