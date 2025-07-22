import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  function isEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) return false;
      if (item.freePreview) hasFreePreview = true;
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const response = currentEditedCourseId
      ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
      : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

    if (response?.success) {
      const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4 text-white">
           {/* Back to Dashboard button */}
    <div className="flex items-center justify-between mb-6">
  <Button
    onClick={() => navigate("/instructor")}
    variant="ghost"
    className="group flex items-center gap-2 text-white bg-indigo-600 text-sm px-4 py-2 rounded-md transition-all duration-200 hover:bg-white/10 hover:pl-5"
  >
    <span className="text-lg transition-transform duration-200 group-hover:-translate-x-1">←</span>
    <span className="font-medium tracking-wide">Back to Dashboard</span>
  </Button>
</div>
      <div className="max-w-6xl mx-auto">
    

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Create a New Course</h1>
          <Button
            disabled={!validateFormData()}
            className="text-sm font-semibold px-6 py-2 shadow-md bg-indigo-600 hover:bg-indigo-700 transition"
            onClick={handleCreateCourse}
          >
            SUBMIT
          </Button>
        </div>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
          <CardContent className="p-6">
            <Tabs defaultValue="curriculum" className="space-y-6">
              <TabsList className="flex space-x-4 bg-white/10 rounded-md p-1 mb-6">
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-md">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="course-landing-page" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-md">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 rounded-md">
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>

              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>

              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddNewCoursePage;
