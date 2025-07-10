// src/components/RazorpayButton.jsx
// import React from "react";

// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const RazorpayButton = ({ amount, token }) => {
//   const createOrder = async () => {
//     const res = await fetch("http://localhost:5000/api/payment/create-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // your JWT token
//       },
//       body: JSON.stringify({ amount }),
//     });
//     const data = await res.json();
//     return data.order;
//   };

//   const handlePayment = async () => {
//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) {
//       alert("Failed to load Razorpay SDK.");
//       return;
//     }

//     const order = await createOrder();
//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Jayadhi Premium",
//       description: "Premium Subscription",
//       order_id: order.id,
//       handler: async function (response) {
//         // Send this response to backend for verification
//         const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             amount: order.amount / 100, // converting back to ₹
//           }),
//         });

//         const result = await verifyRes.json();
//         alert(result.message || "Payment Verified!");
//       },
//       theme: { color: "#0f172a" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <button onClick={handlePayment} className="bg-blue-600 text-white px-4 py-2 rounded">
//       Buy Premium ₹{amount}
//     </button>
//   );
// };

// export default RazorpayButton;
