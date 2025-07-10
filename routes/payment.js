const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../services/paymentService');
const { authenticateToken } = require('../middleware/auth');
const requirePremium = require('../middleware/subscription');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Create Razorpay Order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const order = await createOrder(amount);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Razorpay Payment
router.post('/verify-payment', authenticateToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

  try {
    const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Save payment record
    await Payment.create({
      user: req.user.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount
    });

    // Update user subscription to premium
    await User.findByIdAndUpdate(req.user.id, {
      subscription: {
        plan: 'premium',
        status: 'active',
        startDate: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified and subscription upgraded.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Premium AI Feature Access (Optional)
router.get('/ai-insights', authenticateToken, requirePremium, async (req, res) => {
  res.json({ data: '🔥 Your AI Threat Insights' });
});

module.exports = router;
