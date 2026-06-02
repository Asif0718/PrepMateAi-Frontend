import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBookOpen,
  FaBriefcase,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";

function Nav({
  subtitle = "Resume analysis & preparation guide",
  showBack = false,
  backTo = "/dashboard",
  centerTitle = false,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("preparationGuide");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    navigate("/login", { replace: true });
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black transition"
            >
              <FaArrowLeft />
              Back
            </button>
          )}

          {!centerTitle && (
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Placement Assistant
              </h2>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          )}
        </div>

        {centerTitle && (
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Placement Assistant
            </h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:scale-105 transition"
          >
            <FaUserCircle size={24} />
            Profile
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3">
              <button
                type="button"
                onClick={() => navigate("/prep-history")}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-800 font-medium transition"
              >
                <FaBookOpen className="text-indigo-600" />
                Prep History
              </button>

              <button
                type="button"
                onClick={() => navigate("/applied-jobs")}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-800 font-medium transition"
              >
                <FaBriefcase className="text-indigo-600" />
                Applied Jobs
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;