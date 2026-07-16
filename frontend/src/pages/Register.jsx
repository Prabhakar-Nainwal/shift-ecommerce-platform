import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth(); 
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      // Clean transfer of email to the next page so user doesn't retype it
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">Create Account</h1>
        <p className="text-center text-slate-500 mt-2 mb-8">Get started with your details</p>

        {message && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            pattern="[6-9]\d{9}"
            title="Enter a valid 10-digit phone number"
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Send Verification Code
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          Already have an account?
          <Link to="/login" className="ml-2 text-indigo-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}