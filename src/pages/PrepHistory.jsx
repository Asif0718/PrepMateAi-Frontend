import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function PrepHistory() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/resume/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.log(err.response?.data || err);
      }
    };

    fetchHistory();
  }, [token]);

  const openGuide = (guide) => {
    localStorage.setItem("preparationGuide", guide);
    navigate("/preparation-guide");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-900 text-white px-4 py-2 rounded-xl"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Preparation History</h1>

      <div className="grid gap-4">
        {history.length > 0 ? (
          history.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-bold">{item.resume_file}</h3>
              <p className="text-sm text-gray-500">{item.uploaded_at}</p>

              <button
                onClick={() => openGuide(item.preparation_guide)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                View Guide
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No preparation history found.</p>
        )}
      </div>
    </div>
  );
}

export default PrepHistory;