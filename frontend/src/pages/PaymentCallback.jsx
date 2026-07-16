import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/paymentServices";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | pending | failed
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const cfOrderId = searchParams.get("order_id");

    if (!cfOrderId) {
      setStatus("failed");
      setMessage("Missing payment reference. If money was deducted, it will be refunded automatically.");
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await verifyPayment(cfOrderId);
        if (res.data.success) {
          setStatus("success");
          setMessage("Payment successful! Your order has been confirmed.");
        } else if (res.data.data?.order?.paymentStatus === "Pending") {
          setStatus("pending");
          setMessage("Your payment is still being processed. We'll update your order shortly.");
        } else {
          setStatus("failed");
          setMessage(res.data.message || "Payment could not be verified.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage(error.response?.data?.message || "Something went wrong while verifying your payment.");
      }
    };

    checkPayment();
  }, [searchParams]);

  const iconFor = {
    verifying: <Loader2 className="w-14 h-14 mx-auto text-indigo-600 animate-spin" />,
    success: <CheckCircle2 className="w-14 h-14 mx-auto text-green-600" />,
    pending: <Clock className="w-14 h-14 mx-auto text-amber-500" />,
    failed: <XCircle className="w-14 h-14 mx-auto text-red-600" />
  };

  const titleFor = {
    verifying: "Verifying Payment",
    success: "Payment Successful",
    pending: "Payment Pending",
    failed: "Payment Failed"
  };

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {iconFor[status]}
        <h1 className="text-2xl font-bold mt-4 text-slate-800">{titleFor[status]}</h1>
        <p className="text-slate-500 mt-2">{message}</p>

        {status !== "verifying" && (
          <button
            onClick={() => navigate("/account/orders")}
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            View My Orders
          </button>
        )}
      </div>
    </div>
  );
}
