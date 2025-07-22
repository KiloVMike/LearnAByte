import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 lg:px-20">
      <h1 className="text-4xl font-bold mb-12 text-center">🎓 My Courses</h1>

      {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {studentBoughtCoursesList.map((course) => (
            <Card
              key={course.id}
              className="bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-2xl shadow-lg hover:shadow-indigo-400/30 transition hover:scale-[1.02] flex flex-col"
            >
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-48 w-full object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold mb-1 hover:text-indigo-400 transition">
                  {course?.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <h1 className="text-center text-gray-400 text-xl font-semibold">
          You haven’t enrolled in any course yet.
        </h1>
      )}
    </div>
  );
}

export default StudentCoursesPage;
