import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Nav from "../components/Nav";
import { FaCloudUploadAlt } from "react-icons/fa";

function Dashboard() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

      const res = await API.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("preparationGuide", res.data.preparation_guide);

      alert("Resume analyzed successfully");
      navigate("/preparation-guide");
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Nav subtitle="Resume analysis & preparation guide" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Smart Resume Analyzer
              </h3>
              <p className="text-gray-500 text-sm mt-3 leading-6">
                Upload your resume and paste a job description. AI will generate
                a personalized preparation guide for you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold">What you get?</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/90">
                <li>✓ Resume matching score</li>
                <li>✓ Missing skills suggestion</li>
                <li>✓ Interview preparation guide</li>
                <li>✓ Job role improvement tips</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Upload Resume & Job Description
              </h2>
              <p className="text-gray-500 mt-2">
                Get your personalized AI preparation roadmap
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Resume PDF
                </label>

                <label className="flex flex-col items-center justify-center w-full min-h-44 border-2 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/50 cursor-pointer hover:bg-indigo-50 transition">
                  <FaCloudUploadAlt className="text-5xl text-indigo-600 mb-3" />

                  <p className="text-gray-700 font-semibold">
                    {resume ? resume.name : "Click to upload your resume"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Only PDF files are supported
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    required
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Description
                </label>

                <textarea
                  placeholder="Paste job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  rows="2"
                  className="w-full p-5 rounded-2xl border border-gray-200 outline-none resize-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-indigo-300 hover:scale-[1.01] active:scale-[0.98] transition disabled:opacity-60"
              >
                {loading ? "Analyzing Resume..." : "Generate Preparation Guide"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="w-full py-4 rounded-2xl bg-white border-2 border-indigo-500 text-indigo-600 font-bold shadow-md hover:bg-indigo-50 hover:scale-[1.01] active:scale-[0.98] transition"
              >
                View Job Recommendations
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;