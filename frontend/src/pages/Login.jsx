import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from 'react-router-dom'


export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormdata] = useState({ name: "", email: "", password: "" })
  const [message,setMessage] = useState("")
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(formData);
        navigate("/shop", { replace: true });
      } else {
        await register(formData);

        setMessage(
          "Registration successful! You can now log in with your email and password."
        );

        setFormdata({
          name: "",
          email: "",
          password: "",
        });

        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-center text-slate-500 mt-2 mb-8">
          {isLogin
            ? "Sign in to continue"
            : "Create your account to get started"}
        </p>
        {message && (
          <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 p-3">
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-300"></div>
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300"></div>
        </div>

        <button
          className="w-full border border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-slate-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-center text-slate-600 mt-6">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-600 font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}