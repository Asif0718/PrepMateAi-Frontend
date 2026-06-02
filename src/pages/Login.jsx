import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Nav from "../components/Nav";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        alert("Login successful");
        window.location.href = "/dashboard";
      } else {
        alert("Token not received from backend");
      }
    } catch (err) {
      console.log("Login error:", err.response?.data || err);
      alert("Invalid login details");
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
      Welcome Back!
    </h1>

    <p className="mt-4 text-white/80">
      Login to continue your AI placement preparation journey.
    </p>

    <div className="mt-12 bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold">AI Career Assistant</h2>
      <p className="mt-3 text-sm text-white/80">
        Resume analysis, job suggestions, interview preparation and skill tracking.
      </p>
    </div>
  </div>
</div>

        {/* Login Form */}
        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-500 mt-2">
              Enter your details to access your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-indigo-600" />
                Remember me
              </label>

              <a href="#" className="text-indigo-600 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            New user?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;