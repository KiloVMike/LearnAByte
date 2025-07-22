import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white font-sans px-6 lg:px-20 py-12">
  <div className="mb-12 animate-fade-in-up">
    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-indigo-400">
      {studentViewCourseDetails?.title}
    </h1>
    <p className="text-lg text-gray-300">{studentViewCourseDetails?.subtitle}</p>
    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mt-4">
      <span>👨‍🏫 {studentViewCourseDetails?.instructorName}</span>
      <span>📅 {studentViewCourseDetails?.date?.split("T")[0]}</span>
      <span className="flex items-center">
        <Globe className="mr-1 h-4 w-4" />
        {studentViewCourseDetails?.primaryLanguage}
      </span>
      <span>
        👥 {studentViewCourseDetails?.students?.length}{" "}
        {studentViewCourseDetails?.students?.length <= 1 ? "Student" : "Students"}
      </span>
    </div>
  </div>

  <div className="flex flex-col lg:flex-row gap-12">
    {/* Left Side (Details) */}
    <main className="flex-grow space-y-10">
      {/* Objectives */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">🎯 What you'll learn</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {studentViewCourseDetails?.objectives?.split(",").map((objective, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-green-400 mr-2 mt-1" />
              <span className="text-white">{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Description */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">📘 Course Description</h2>
        <p className="text-gray-300">{studentViewCourseDetails?.description}</p>
      </div>

      {/* Curriculum */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">📚 Course Curriculum</h2>
        <ul className="space-y-3">
          {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 ${
                curriculumItem?.freePreview ? "cursor-pointer hover:text-indigo-400" : "cursor-not-allowed opacity-60"
              }`}
              onClick={() =>
                curriculumItem?.freePreview && handleSetFreePreview(curriculumItem)
              }
            >
              {curriculumItem?.freePreview ? (
                <PlayCircle className="text-indigo-400" />
              ) : (
                <Lock className="text-gray-400" />
              )}
              <span>{curriculumItem?.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>

    {/* Right Side (Buy Now) */}
    <aside className="w-full lg:w-[400px] space-y-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 sticky top-6">
        <div className="aspect-video mb-4 rounded-xl overflow-hidden shadow-inner">
          <VideoPlayer
            url={
              getIndexOfFreePreviewUrl !== -1
                ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.videoUrl
                : ""
            }
            width="100%"
            height="100%"
          />
        </div>
        <div className="text-3xl font-extrabold text-indigo-400 mb-4">
          ₹ {studentViewCourseDetails?.pricing}
        </div>
        <Button
          onClick={handleCreatePayment}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition duration-300"
        >
          🛒 Buy Now
        </Button>
      </div>
    </aside>
  </div>

  {/* Free Preview Dialog */}
  <Dialog
    open={showFreePreviewDialog}
    onOpenChange={() => {
      setShowFreePreviewDialog(false);
      setDisplayCurrentVideoFreePreview(null);
    }}
  >
    <DialogContent className="w-[800px] max-w-full">
      <DialogHeader>
        <DialogTitle className="text-indigo-400">🎬 Course Preview</DialogTitle>
      </DialogHeader>
      <div className="aspect-video mb-4 rounded-xl overflow-hidden shadow">
        <VideoPlayer url={displayCurrentVideoFreePreview} width="100%" height="100%" />
      </div>
      <div className="flex flex-col gap-2 text-white">
        {studentViewCourseDetails?.curriculum
          ?.filter((item) => item.freePreview)
          .map((filteredItem, idx) => (
            <p
              key={idx}
              onClick={() => handleSetFreePreview(filteredItem)}
              className="cursor-pointer hover:text-indigo-400 transition font-medium"
            >
              ▶ {filteredItem?.title}
            </p>
          ))}
      </div>
      <DialogFooter className="mt-4 sm:justify-start">
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  );
}
export default StudentViewCourseDetailsPage;
