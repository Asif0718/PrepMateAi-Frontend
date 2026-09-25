import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { apiError } from "../api";
import Nav from "../components/Nav";
import TailorModal from "../components/TailorModal";
import { ExternalLink, CheckCircle2, MapPin, Building2, Clock, Search, Wand2, Check, Plus } from "lucide-react";
import Reveal from "../components/Reveal";
import { useToast } from "../components/toast-context";

function matchColor(score) {
  if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

function JobCard({ job, index, applied, onApply, onTailor, canTailor }) {
  const match = job.match;

  return (
    <Reveal as="article" index={index % 3} className="job-card card card-hover">
      <div className="job-card-header">
        <div className="job-card-icon">
          <Building2 size={18} />
        </div>
        <div className="job-card-meta flex-1">
          <h3 className="job-card-title">{job.title || "Untitled"}</h3>
          <p className="job-card-company">{job.company || "Company"}</p>
        </div>
        {match && (
          <span
            title="How many of this job's skills are on your resume"
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${matchColor(match.score)}`}
          >
            {match.score}% match
          </span>
        )}
      </div>
      <div className="job-card-details">
        {job.location && (
          <span className="chip">
            <MapPin size={13} />
            {job.location}
          </span>
        )}
        {job.type && (
          <span className="chip">
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
      {match && (match.matched.length > 0 || match.missing.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {match.matched.slice(0, 5).map((s) => (
            <span key={s} className="chip border-ink text-ink"><Check size={11} /> {s}</span>
          ))}
          {match.missing.slice(0, 4).map((s) => (
            <span key={s} className="chip border-dashed text-mute"><Plus size={11} /> {s}</span>
          ))}
        </div>
      )}
      <div className="job-card-actions">
        {job.apply_link ? (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Apply <ExternalLink size={14} />
          </a>
        ) : (
          <span className="btn btn-sm cursor-default bg-neutral-100 text-mute">No link</span>
        )}
        <button
          type="button"
          disabled={applied}
          onClick={() => onApply(job)}
          className={`btn btn-sm ${applied ? "bg-neutral-100 text-graphite" : "btn-secondary"}`}
        >
          <CheckCircle2 size={14} />
          {applied ? "Applied" : "Mark"}
        </button>
        {canTailor && job.description && (
          <button type="button" onClick={() => onTailor(job)} className="btn btn-secondary btn-sm">
            <Wand2 size={14} />
            Tailor
          </button>
        )}
      </div>
    </Reveal>
  );
}

function JobSkeleton() {
  return (
    <div className="job-card job-card-skeleton card">
      <div className="skeleton skel-line skel-title" />
      <div className="skeleton skel-line skel-company" />
      <div className="skeleton skel-line skel-desc" />
      <div className="skeleton skel-line skel-desc-short" />
      <div className="job-card-actions">
        <div className="skeleton skel-btn" />
        <div className="skeleton skel-btn" />
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
  const [hasResume, setHasResume] = useState(null);
  const [tailorJob, setTailorJob] = useState(null);
  const toast = useToast();

  useEffect(() => {
    API.get("/jobs/applied")
      .then((res) => setAppliedJobs(res.data.applied_jobs || []))
      .catch(() => {});
  }, []);

  const fetchJobs = async () => {
    if (!query.trim() || !location.trim()) {
      setError("Enter a job role and a location to search.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await API.get("/jobs/search", { params: { query, location } });
      setJobs(res.data.jobs || []);
      setHasResume(res.data.has_resume);
    } catch (err) {
      setError(apiError(err, "Failed to fetch jobs"));
    } finally {
      setLoading(false);
    }
  };

  const markAsApplied = async (job) => {
    try {
      const res = await API.post("/jobs/applied", {
        title: job.title,
        company: job.company,
        location: job.location,
        apply_link: job.apply_link,
      });
      setAppliedJobs((prev) => [res.data.job, ...prev]);
      toast.success("Added to your tracker");
    } catch {
      toast.error("Could not add this job to your tracker.");
    }
  };

  const isAlreadyApplied = (job) =>
    appliedJobs.some(
      (a) => a.title === job.title && a.company === job.company && a.location === job.location
    );

  return (
    <div className="min-h-[100dvh]">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <section className="mb-10">
          <h1 className="text-4xl font-semibold md:text-5xl">Find jobs</h1>
          <p className="mt-3 text-lg text-graphite">Search by role and location. Each result shows how well it matches your resume.</p>
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
          <button onClick={fetchJobs} disabled={loading} className="btn btn-primary">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="jobs-error">{error}</p>}

        {hasResume === false && jobs.length > 0 && (
          <p className="mb-6 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-graphite">
            <Link to="/dashboard" className="font-semibold text-ink underline underline-offset-4">Upload your resume</Link>{" "}
            to see your match score for each job and tailor your resume to it.
          </p>
        )}

        <div className="jobs-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobSkeleton key={i} />)
            : jobs.length > 0
            ? jobs.map((job, i) => (
                <JobCard
                  key={`${job.company}-${job.title}-${i}`}
                  job={job}
                  index={i}
                  applied={isAlreadyApplied(job)}
                  onApply={markAsApplied}
                  onTailor={setTailorJob}
                  canTailor={hasResume}
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

      {tailorJob && <TailorModal job={tailorJob} onClose={() => setTailorJob(null)} />}
    </div>
  );
}
