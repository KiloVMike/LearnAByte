import { courseCategories } from "@/config";
import banner from "../../../assets/LMS.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [getCurrentId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(getCurrentCourseId, auth?.user?._id);
    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

return (
  <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white font-sans">

    {/* Hero Section */}
    <section className="relative px-6 lg:px-16 py-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-16">
      <div className="lg:w space-y-8 text-center lg:text-left animate-fade-in-up">
        <h1 className="text-7xl md:text-6xl font-extrabold leading-tight">
          Transform  <span className="text-indigo-400">the Way You Learn</span>
        </h1>
        <p className="text-3xl text-gray-300 max-w-lg mx-auto lg:mx-0">
          Handpicked premium courses taught by world-class instructors. Unlock your potential today.
        </p>
        <Button
          onClick={() => navigate("/courses")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-12 py-5 rounded-full shadow-lg transition duration-300 hover:shadow-indigo-400/50 text-2xl"
        >
          🚀 Browse Courses
        </Button>
      </div>

      <div className="lg:w-1/2 relative">
        <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl  transition duration-500 ease-in-out">
          <img
            src={banner}
            alt="Hero"
            className="w-full h-full object-cover rounded-[2rem]"
          />
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 opacity-30 blur-3xl rounded-full animate-ping"></div>
      </div>
    </section>

    {/* Category Section */}
    <section className="px-6 lg:px-20 py-20">
      <h2 className="text-4xl font-bold text-center mb-14 text-white tracking-tight">
        ✨ Explore Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {courseCategories.map((categoryItem) => (
          <div
            key={categoryItem.id}
            onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            className="cursor-pointer bg-white/10 hover:bg-white/20 transition duration-300 text-center py-5 rounded-2xl shadow hover:shadow-indigo-400/30 border border-white/20 font-semibold text-white backdrop-blur-lg hover:scale-105"
          >
            {categoryItem.label}
          </div>
        ))}
      </div>
    </section>

    {/* Courses */}
    <section className="px-6 lg:px-20 py-20 bg-white/5 rounded-t-[4rem] shadow-inner backdrop-blur-md">
      <h2 className="text-4xl font-bold text-center text-white mb-16 tracking-tight">
        🌟 Featured Courses
      </h2>
      {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {studentViewCoursesList.map((courseItem) => (
            <div
              key={courseItem._id}
              onClick={() => handleCourseNavigate(courseItem?._id)}
              className="cursor-pointer group bg-white/10 rounded-2xl p-4 shadow-xl border border-white/20 backdrop-blur-md hover:scale-[1.03] hover:shadow-indigo-400/40 transition-all duration-300"
            >
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={courseItem?.image}
                  alt={courseItem?.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                  {courseItem?.title}
                </h3>
                <p className="text-sm text-gray-400">{courseItem?.instructorName}</p>
                <p className="text-indigo-400 font-semibold mt-2">₹ {courseItem?.pricing}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg">No courses available right now.</p>
      )}
    </section>
  </div>
);

}

export default StudentHomePage;
