import { Button } from "@/components/ui/button";
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
    const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
    } else {
      setStudentViewCourseDetails(null);
    }
    setLoadingState(false);
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

async function handleCreatePayment() {
  const paymentPayload = {
    userId: auth?.user?._id,
    userName: auth?.user?.userName,
    userEmail: auth?.user?.userEmail,
    orderStatus: "pending",
    paymentMethod: "razorpay",
    paymentStatus: "initiated",
    orderDate: new Date(),
    instructorId: studentViewCourseDetails?.instructorId,
    instructorName: studentViewCourseDetails?.instructorName,
    courseImage: studentViewCourseDetails?.image,
    courseTitle: studentViewCourseDetails?.title,
    courseId: studentViewCourseDetails?._id,
    coursePricing: studentViewCourseDetails?.pricing,
  };

  try {
    const response = await createPaymentService(paymentPayload);

    if (!response?.success) {
      throw new Error("Payment URL missing or request failed.");
    }

    const {
      razorpayOrderId,
      amount,
      currency,
      orderId,
    } = response.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use your env var
      amount: amount.toString(),
      currency,
      name: "Readiculous",
      description: "Course Purchase",
      image: "/logo.svg", // Optional logo
      order_id: razorpayOrderId,
      handler: async function (res) {
        // After payment success
        const captureResponse = await fetch("/api/student/order/capture", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpayPaymentId: res.razorpay_payment_id,
            razorpayOrderId: res.razorpay_order_id,
            orderId: orderId,
          }),
        });

        const captureData = await captureResponse.json();

        if (captureData.success) {
          navigate(`/course-progress/${studentViewCourseDetails?._id}`);
        } else {
          alert("Payment succeeded, but order finalization failed.");
        }
      },
      prefill: {
        name: auth?.user?.userName,
        email: auth?.user?.userEmail,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    alert("Something went wrong while initiating payment.");
  }
}


  useEffect(() => {
    if (approvalUrl !== "") {
  window.location.href = approvalUrl;
}
  }, [approvalUrl]);

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (currentCourseDetailsId) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails?.curriculum?.findIndex((item) => item.freePreview) ?? -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white px-6 lg:px-20 py-12">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-indigo-400 mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-lg text-gray-300">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4">
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
        {/* Left - Main Content */}
        <main className="flex-grow space-y-10">
          <section className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">🎯 What You'll learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentViewCourseDetails?.objectives
                ?.split(",")
                ?.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-400 mr-2 mt-1" />
                    <span>{objective}</span>
                  </li>
                ))}
            </ul>
          </section>

          <section className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">📘 Description</h2>
            <p className="text-gray-300">{studentViewCourseDetails?.description}</p>
          </section>

          <section className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">📚 Curriculum</h2>
            <ul className="space-y-3">
              {studentViewCourseDetails?.curriculum?.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-3 ${
                    item?.freePreview
                      ? "cursor-pointer hover:text-indigo-400"
                      : "cursor-not-allowed opacity-60"
                  }`}
                  onClick={() =>
                    item?.freePreview && handleSetFreePreview(item)
                  }
                >
                  {item?.freePreview ? (
                    <PlayCircle className="text-indigo-400" />
                  ) : (
                    <Lock className="text-gray-400" />
                  )}
                  <span>{item?.title}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* Right - Buy Section */}
        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="bg-white/10 p-6 rounded-2xl border border-white/20 sticky top-6">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <VideoPlayer
                url={
                  getIndexOfFreePreviewUrl !== -1
                    ? studentViewCourseDetails?.curriculum?.[getIndexOfFreePreviewUrl]
                        ?.videoUrl
                    : ""
                }
              />
            </div>
            <div className="text-3xl font-extrabold text-indigo-400 mb-4">
              ₹ {studentViewCourseDetails?.pricing}
            </div>
            <Button
              onClick={handleCreatePayment}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full"
            >
              🛒 Buy Now
            </Button>
          </div>
        </aside>
      </div>

      {/* Preview Modal */}
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
          <div className="aspect-video mb-4 rounded-lg overflow-hidden">
            <VideoPlayer url={displayCurrentVideoFreePreview} />
          </div>
          <div className="flex flex-col gap-2 text-white">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((item, idx) => (
                <p
                  key={idx}
                  onClick={() => handleSetFreePreview(item)}
                  className="cursor-pointer hover:text-indigo-400"
                >
                  ▶ {item?.title}
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
