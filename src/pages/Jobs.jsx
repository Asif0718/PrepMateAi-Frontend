import { useEffect, useState } from "react";
import API from "../api";
import Nav from "../components/Nav";
import { FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/jobs/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppliedJobs(res.data.applied_jobs || []);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    if (!query.trim() || !location.trim()) {
      alert("Please enter job role and location");
      return;
    }

    try {
      setLoading(true);

      const res = await API.get("/jobs/search", {
        params: { query, location },
      });

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const markAsApplied = async (job) => {
    try {
      await API.post(
        "/jobs/applied",
        {
          title: job.title,
          company: job.company,
          location: job.location,
          apply_link: job.apply_link,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Job marked as applied");
      fetchAppliedJobs();
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Failed to mark as applied");
    }
  };

  const isAlreadyApplied = (job) => {
    return appliedJobs.some(
      (applied) =>
        applied.title === job.title &&
        applied.company === job.company &&
        applied.location === job.location
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Nav
          subtitle="Your AI preparation roadmap"
          showBack={true}
          backTo="/dashboard"
          centerTitle={true}
        />

      <div className="max-w-7xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Job Recommendations
        </h1>
        <p className="text-gray-500 mt-3">
          Search jobs based on your skills and preferred location
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="border p-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job role e.g. React Developer"
            />

            <input
              className="border p-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Country e.g. India"
            />

            <button
              onClick={fetchJobs}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:scale-[1.01] transition disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {loading ? (
            <p className="text-center text-gray-600">Fetching jobs...</p>
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => {
              const applied = isAlreadyApplied(job);

              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/60"
                >
                  <h2 className="text-xl font-bold text-indigo-700">
                    {job.title || "No title"}
                  </h2>

                  <p className="text-gray-700 font-medium mt-1">
                    {job.company || "Company not available"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {job.location || "Location not available"}
                  </p>

                  <p className="mt-4 text-gray-600 leading-7">
                    {job.description
                      ? `${job.description.slice(0, 250)}...`
                      : "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">
                    {job.apply_link ? (
                      <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
                      >
                        Apply Now <FaExternalLinkAlt size={13} />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-block bg-gray-400 text-white px-5 py-2 rounded-xl cursor-not-allowed"
                      >
                        Link Not Available
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={applied}
                      onClick={() => markAsApplied(job)}
                      className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl transition ${
                        applied
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      <FaCheckCircle />
                      {applied ? "Applied" : "Mark Applied"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
          
              <p className="text-gray-600 text-center">
                Search jobs by entering role and location.
              </p>
            
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;