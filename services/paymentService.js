const razorpay = require('../config/razorpay'); // Instance
const crypto = require('crypto');

const createOrder = async (amount, currency = 'INR') => {
  try {
    const options = {
      amount: amount * 100, // ₹ to paisa
      currency,
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("🔴 Razorpay Order Creation Error:", error);
    throw new Error('Failed to create Razorpay order: ' + (error.message || error));
  }
};

const verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  createOrder,
  verifyPayment
};
