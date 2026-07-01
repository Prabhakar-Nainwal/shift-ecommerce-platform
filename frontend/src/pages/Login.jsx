import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Invalid credentials. Try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">Welcome Back</h1>
        <p className="text-center text-slate-500 mt-2 mb-8">Sign in to continue</p>

        {message && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {/* Added Forgot Password navigation link */}
            <div className="text-right mt-1.5">
              <Link 
                to="/forgot-password" 
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        <button className="w-full border border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-slate-600 mt-6">
          Don't have an account? 
          <Link to="/register" className="ml-2 text-indigo-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}