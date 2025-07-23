import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function RazorpayPaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const razorpayPaymentId = params.get("razorpay_payment_id");
  const razorpayOrderId = params.get("razorpay_order_id");
  const razorpaySignature = params.get("razorpay_signature"); // Optional for now

  useEffect(() => {
    if (razorpayPaymentId && razorpayOrderId) {
      async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

        const response = await captureAndFinalizePaymentService(
          razorpayPaymentId,
          razorpayOrderId,
          orderId
        );

        if (response?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/student-courses";
        }
      }

      capturePayment();
    }
  }, [razorpayPaymentId, razorpayOrderId, razorpaySignature]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default RazorpayPaymentReturnPage;
