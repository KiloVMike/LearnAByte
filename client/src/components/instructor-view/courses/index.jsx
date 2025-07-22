import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <Card className="bg-white/5 text-white border border-white/10 backdrop-blur-sm shadow-md">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-semibold text-white">
          All Courses
        </CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {listOfCourses?.length > 0 ? (
            <Table className="w-full text-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white/80">Course</TableHead>
                  <TableHead className="text-white/80">Students</TableHead>
                  <TableHead className="text-white/80">Revenue</TableHead>
                  <TableHead className="text-white/80 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses.map((course, index) => (
                  <TableRow
                    key={course._id || index}
                    className="hover:bg-white/10 transition-all duration-200"
                  >
                    <TableCell className="font-medium">{course?.title}</TableCell>
                    <TableCell>{course?.students?.length || 0}</TableCell>
                    <TableCell>
                      ₹{(course?.students?.length || 0) * course?.pricing}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        onClick={() =>
                          navigate(`/instructor/edit-course/${course?._id}`)
                        }
                        variant="ghost"
                        size="icon"
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600"
                      >
                        <Delete className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-300">No courses created yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
