import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.log("Register error:", err.response?.data || err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Design Section */}
        {/* Left Design Section */}
<div className="hidden md:flex relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 text-white flex-col items-center justify-center text-center">
  <div className="absolute top-24 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
  <div className="absolute bottom-24 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-2xl"></div>

  <div className="relative z-10 max-w-sm">
    <h1 className="text-4xl font-bold leading-tight">
      Start Your Journey!
    </h1>

    <p className="mt-4 text-white/80">
      Create your account and unlock your AI career assistant.
    </p>

    <div className="mt-12 bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold">Placement Prep AI</h2>
      <p className="mt-3 text-sm text-white/80">
        Analyze resumes, find job matches, improve skills and prepare for interviews.
      </p>
    </div>
  </div>
</div>

        {/* Register Form */}
        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">
              Fill your details to register
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;