export const initiatePayment = async ({ order, token }) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'Jayadhi Cyber Platform',
      description: 'Premium Subscription',
      order_id: order.id,
      handler: function (response) {
        resolve(response);
      },
      prefill: {
        name: 'Harsh Kumar', // Replace with dynamic user info
        email: 'harshk8876@gmail.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response) {
      reject(response.error);
    });
  });
};
