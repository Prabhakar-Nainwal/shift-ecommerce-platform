import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp } = useAuth();
  
  const [email, setEmail] = useState(() => {
    return location.state?.email || localStorage.getItem("otp_email") || "";
  });
  
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      localStorage.setItem("otp_email", location.state.email);
      setEmail(location.state.email);
    } else if (!email) {
      setMessage("No email found. Redirecting to registration...");
      setTimeout(() => navigate("/register"), 3000);
    }
  }, [location.state, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp });
      setIsSuccess(true);
      setMessage("Email verified successfully! Taking you to shop...");
      localStorage.removeItem("otp_email");

      setTimeout(() => {
        navigate("/shop", { replace: true });
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Invalid or expired OTP code.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">Verify Email</h1>
        <p className="text-center text-slate-500 mt-2 mb-6">
          We sent a verification code to <br />
          <span className="font-semibold text-slate-700">{email || "your email"}</span>
        </p>

        {message && (
          <div className={`mb-4 rounded-lg p-3 border ${
            isSuccess 
              ? "bg-green-100 border-green-300 text-green-700" 
              : "bg-red-100 border-red-300 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            className="w-full text-center tracking-widest text-2xl font-bold border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Verify & Create Account
          </button>
        </form>
      </div>
    </div>
  );
}