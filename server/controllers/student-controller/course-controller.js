const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log("req.query:", req.query);

    const filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    const sortParam = {
      ...(sortBy === "price-lowtohigh" && { pricing: 1 }),
      ...(sortBy === "price-hightolow" && { pricing: -1 }),
      ...(sortBy === "title-atoz" && { title: 1 }),
      ...(sortBy === "title-ztoa" && { title: -1 }),
    };

    const coursesList = await Course.find(filters).sort(
      Object.keys(sortParam).length ? sortParam : { pricing: 1 }
    );

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.error("getAllStudentViewCourses error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
        data: null,
      });
    }

    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error("getStudentViewCourseDetails error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const studentCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentCourses || !Array.isArray(studentCourses.courses)) {
      return res.status(200).json({
        success: true,
        data: false, // Student hasn't purchased the course
      });
    }

    const ifStudentAlreadyBoughtCurrentCourse = studentCourses.courses.some(
      (item) => item.courseId === id
    );

    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.error("checkCoursePurchaseInfo error:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};
