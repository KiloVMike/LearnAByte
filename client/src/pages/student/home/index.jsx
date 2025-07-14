import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-20 py-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white animate-fade-in">
            Transform the Way You Learn
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            Handpicked premium courses from the world’s top instructors.
          </p>
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-xl transition-all">
            View All Courses
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-center relative">
          <div className="rounded-[2rem] overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.4)] backdrop-blur-lg bg-white/10 border border-white/20 transform hover:scale-105 transition duration-700 ease-in-out">
            <img
              src={banner}
              alt="Hero"
              className="w-full h-full object-cover rounded-[2rem]"
            />
          </div>
          <div className="absolute w-40 h-40 bg-indigo-500 opacity-30 blur-3xl rounded-full animate-pulse -bottom-6 -right-6"></div>
        </div>
      </section>

      {/* Category Section */}
      <section className="px-6 lg:px-20 py-16">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          ✨ Explore Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {courseCategories.map((categoryItem) => (
            <div
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              className="cursor-pointer bg-white/10 hover:bg-white/20 transition duration-300 text-center py-4 rounded-xl backdrop-blur-xl shadow hover:shadow-indigo-500/30 border border-white/20 font-medium text-white"
            >
              {categoryItem.label}
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="px-6 lg:px-20 py-20 bg-white/5 rounded-t-[4rem] shadow-inner backdrop-blur">
        <h2 className="text-4xl font-bold text-center text-white mb-14">
          🌟 Featured Courses
        </h2>
        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem._id}
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="cursor-pointer group bg-white/10 rounded-2xl p-4 shadow-xl border border-white/20 backdrop-blur-md hover:scale-[1.03] hover:shadow-indigo-400/30 transition-all duration-300"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={courseItem?.image}
                    alt={courseItem?.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition">
                    {courseItem?.title}
                  </h3>ff
                  <p className="text-sm text-gray-300">{courseItem?.instructorName}</p>
                  <p className="text-indigo-400 font-bold mt-2">${courseItem?.pricing}</p>
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
