const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,        // e.g., "created", "confirmed"
  paymentMethod: String,      // e.g., "razorpay"
  paymentStatus: String,      // e.g., "paid", "pending"
  orderDate: Date,

  // Razorpay-specific IDs
  paymentId: String,          // Razorpay payment_id
  payerId: String,            // Optional or can store Razorpay signature

  instructorId: String,
  instructorName: String,
  courseImage: String,
  courseTitle: String,
  courseId: String,
  coursePricing: String       // keep as string to preserve precision (can be "499.00")
});

module.exports = mongoose.model("Order", OrderSchema);
