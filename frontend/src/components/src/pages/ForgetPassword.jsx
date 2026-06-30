import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  // Pulling 'user' from context to dynamically check authentication status
  const { user, handleForgotPassword, handleVerifyForgotPassword } = useAuth();
  const isAuthenticated = !!user; 
  
  const [step, setStep] = useState(1); // Step 1: Send Request, Step 2: Enter Pin & Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSendOtp(e) {
    e.preventDefault();
    try {
      setIsError(false);
      await handleForgotPassword(email);
      setStep(2);
      setMessage("A verification security code has been sent to your email address.");
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "No account found matching that email address.");
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    try {
      setIsError(false);
      await handleVerifyForgotPassword(email, otp, newPassword);
      setIsError(false);
      setMessage("Password changed successfully! Redirecting...");
      
      // Dynamic Redirection based on user session status
      setTimeout(() => {
        if (isAuthenticated) {
          navigate("/account/security", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      }, 2500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || "Invalid or expired validation code.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">Reset Password</h1>
        <p className="text-center text-slate-500 mt-2 mb-6">
          {step === 1 
            ? "Provide your email to receive an access authorization code." 
            : "Enter your verification code along with your new password choice."}
        </p>

        {message && (
          <div className={`mb-4 rounded-lg p-3 text-sm border ${
            isError 
              ? "bg-red-100 border-red-300 text-red-700" 
              : "bg-green-100 border-green-300 text-green-700"
          }`}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
            >
              Send Reset Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              maxLength="6"
              placeholder="6-Digit Verification Pin"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 tracking-widest text-center text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Choose New Password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
            >
              Update Password
            </button>
          </form>
        )}

        {/* Dynamic Contextual Back Button Layout */}
        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="text-sm text-indigo-600 font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            {isAuthenticated ? "Back to Security Settings" : "Back to Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}