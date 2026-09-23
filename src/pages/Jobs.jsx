import { useEffect, useState } from "react";
import API from "../api";
import Nav from "../components/Nav";
import { ExternalLink, CheckCircle2, MapPin, Building2, Clock, Search } from "lucide-react";

function JobCard({ job, applied, onApply }) {
  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="job-card-icon">
          <Building2 size={18} />
        </div>
        <div className="job-card-meta">
          <h3 className="job-card-title">{job.title || "Untitled"}</h3>
          <p className="job-card-company">{job.company || "Company"}</p>
        </div>
      </div>
      <div className="job-card-details">
        {job.location && (
          <span className="job-card-tag">
            <MapPin size={13} />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className="job-card-tag">
            <Clock size={13} />
            {job.type}
          </span>
        )}
      </div>
      {job.description && (
        <p className="job-card-desc">
          {job.description.length > 160
            ? `${job.description.slice(0, 160)}...`
            : job.description}
        </p>
      )}
      <div className="job-card-actions">
        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-apply"
          >
            Apply <ExternalLink size={14} />
          </a>
        ) : (
          <span className="btn-disabled">No link</span>
        )}
        <button
          type="button"
          disabled={applied}
          onClick={() => onApply(job)}
          className={applied ? "btn-applied" : "btn-mark"}
        >
          <CheckCircle2 size={14} />
          {applied ? "Applied" : "Mark"}
        </button>
      </div>
    </article>
  );
}

function JobSkeleton() {
  return (
    <div className="job-card job-card-skeleton">
      <div className="skel-line skel-title" />
      <div className="skel-line skel-company" />
      <div className="skel-line skel-desc" />
      <div className="skel-line skel-desc-short" />
      <div className="job-card-actions">
        <div className="skel-btn" />
        <div className="skel-btn" />
      </div>
    </div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/jobs/applied", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(res.data.applied_jobs || []);
    } catch {
      // silent
    }
  };

  useEffect(() => { fetchAppliedJobs(); }, []);

  const fetchJobs = async () => {
    if (!query.trim() || !location.trim()) {
      setError("Please enter job role and location");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await API.get("/jobs/search", { params: { query, location } });
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const markAsApplied = async (job) => {
    try {
      await API.post("/jobs/applied", {
        title: job.title,
        company: job.company,
        location: job.location,
        apply_link: job.apply_link,
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAppliedJobs();
    } catch {
      alert("Failed to mark as applied");
    }
  };

  const isAlreadyApplied = (job) =>
    appliedJobs.some(
      (a) => a.title === job.title && a.company === job.company && a.location === job.location
    );

  return (
    <div className="jobs-page">
      <Nav subtitle="Find your next role" showBack backTo="/dashboard" centerTitle />

      <main className="jobs-main">
        <section className="jobs-hero">
          <h1>Job Recommendations</h1>
          <p>Search jobs by role and location to find matches</p>
        </section>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Job role, e.g. Frontend Developer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
          />
          <input
            type="text"
            className="search-separator"
            placeholder="Location, e.g. Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
          />
          <button onClick={fetchJobs} disabled={loading} className="btn-search">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="jobs-error">{error}</p>}

        <div className="jobs-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)
            : jobs.length > 0
            ? jobs.map((job, i) => (
                <JobCard
                  key={`${job.company}-${job.title}-${i}`}
                  job={job}
                  applied={isAlreadyApplied(job)}
                  onApply={markAsApplied}
                />
              ))
            : query || location ? (
                <div className="jobs-empty">
                  <p>No jobs found for that search.</p>
                  <p>Try different keywords or a broader location.</p>
                </div>
              ) : (
                <div className="jobs-empty">
                  <p>Enter a role and location above to see recommendations.</p>
                </div>
              )}
        </div>
      </main>
    </div>
  );
}
