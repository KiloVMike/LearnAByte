// helpers/razorpay.js

const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.warn("⚠️ Razorpay keys are missing in environment variables!");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports = razorpay;
