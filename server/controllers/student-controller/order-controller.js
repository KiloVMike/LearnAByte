const razorpayInstance = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    const amountInPaise = parseFloat(coursePricing) * 100; // Razorpay uses paise

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    });

    // Save in DB
    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
      paymentId: razorpayOrder.id,
    });

    await newlyCreatedCourseOrder.save();

    res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: newlyCreatedCourseOrder._id,
      },
    });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = razorpayPaymentId;

    await order.save();

    // Add course to student's list
    const studentCourses = await StudentCourses.findOne({ userId: order.userId });

    const newCourseData = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };

    if (studentCourses) {
      studentCourses.courses.push(newCourseData);
      await studentCourses.save();
    } else {
      await new StudentCourses({
        userId: order.userId,
        courses: [newCourseData],
      }).save();
    }

    // Add student to course's student array
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.error("capturePaymentAndFinalizeOrder error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
