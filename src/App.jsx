import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PreparationGuide from "./pages/PreparationGuide";
import Jobs from "./pages/Jobs";
import PrepHistory from "./pages/PrepHistory";
import AppliedJobs from "./pages/AppliedJobs";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLogin);
    window.addEventListener("authChange", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("authChange", checkLogin);
    };
  }, []);

  return (
    <Routes>
      {/* Public Home Page */}
      <Route path="/" element={<Home />} />

      {/* Auth Pages */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Protected Pages */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/preparation-guide"
        element={
          isLoggedIn ? <PreparationGuide /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/jobs"
        element={isLoggedIn ? <Jobs /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/prep-history"
        element={
          isLoggedIn ? <PrepHistory /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/applied-jobs"
        element={
          isLoggedIn ? <AppliedJobs /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;