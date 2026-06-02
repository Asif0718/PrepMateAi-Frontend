import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await API.get("/jobs/applied", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.applied_jobs || []);
      } catch (err) {
        console.log(err.response?.data || err);
      }
    };

    fetchAppliedJobs();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate("/jobs")}
        className="mb-6 bg-gray-900 text-white px-4 py-2 rounded-xl"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Applied Jobs</h1>

      <div className="grid gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-bold text-indigo-700">{job.title}</h3>
              <p>{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-sm text-gray-400">{job.applied_at}</p>

              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Open Link
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No applied jobs found.</p>
        )}
      </div>
    </div>
  );
}

export default AppliedJobs;