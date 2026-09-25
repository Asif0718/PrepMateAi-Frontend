import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays, ExternalLink, FileSignature, StickyNote, Trash2 } from "lucide-react";
import ApplicationKitModal from "../components/ApplicationKitModal";
import API from "../api";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import { useToast } from "../components/toast-context";

const STAGES = [
  { id: "shortlisted", label: "Shortlisted" },
  { id: "applied", label: "Applied" },
  { id: "online_test", label: "Online test" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

const FOLLOW_UP_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso + "Z")) / DAY_MS) : 0);
const daysUntil = (date) => Math.round((new Date(date + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / DAY_MS);

function reminderFor(job) {
  if (job.interview_date && ["online_test", "interview"].includes(job.status)) {
    const days = daysUntil(job.interview_date);
    if (days >= 0 && days <= 3) {
      return days === 0 ? "Interview today" : `Interview in ${days} day${days > 1 ? "s" : ""}`;
    }
  }
  if (job.status === "applied" && daysSince(job.applied_at) >= FOLLOW_UP_DAYS) {
    return `No reply for ${daysSince(job.applied_at)} days. Send a follow-up`;
  }
  return null;
}

function JobCard({ job, onUpdate, onDelete, onPrepare }) {
  const [notes, setNotes] = useState(job.notes);
  const [showNotes, setShowNotes] = useState(Boolean(job.notes));
  const reminder = reminderFor(job);
  const shortlisted = job.status === "shortlisted";
  const age = daysSince(job.applied_at);

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", job.id)}
      className="dialog cursor-grab space-y-2.5 rounded-xl border border-line bg-white p-3.5 transition-colors hover:border-graphite active:cursor-grabbing"
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-sans text-sm leading-snug font-semibold tracking-normal">{job.title}</h4>
          <p className="truncate text-xs text-mute">
            {[job.company, job.location].filter(Boolean).join(", ")}
          </p>
        </div>
        <button
          type="button"
          aria-label="Remove application"
          onClick={() => onDelete(job)}
          className="shrink-0 text-mute transition-colors hover:text-ink"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {job.match_score != null && (
        <span className="chip border-ink text-ink">{job.match_score}% match</span>
      )}

      {reminder && (
        <p className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800">
          <Bell size={12} /> {reminder}
        </p>
      )}

      <select
        value={job.status}
        onChange={(e) => onUpdate(job.id, { status: e.target.value })}
        aria-label="Stage"
        className="w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-xs"
      >
        {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>

      {["online_test", "interview"].includes(job.status) && (
        <label className="flex items-center gap-2 text-xs text-graphite">
          <CalendarDays size={13} />
          <input
            type="date"
            value={job.interview_date || ""}
            onChange={(e) => onUpdate(job.id, { interview_date: e.target.value })}
            className="flex-1 rounded-lg border border-line px-2 py-1"
          />
        </label>
      )}

      {shortlisted && (
        <button
          type="button"
          onClick={() => onUpdate(job.id, { status: "applied" })}
          className="btn btn-primary btn-sm w-full"
        >
          Mark applied
        </button>
      )}

      <button
        type="button"
        onClick={() => onPrepare(job)}
        className="flex items-center gap-1 text-xs font-medium text-ink hover:underline"
      >
        <FileSignature size={12} /> {job.kit ? "View application kit" : "Application kit"}
      </button>

      {showNotes ? (
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== job.notes && onUpdate(job.id, { notes })}
          placeholder="Recruiter name, round details"
          className="w-full resize-none rounded-lg border border-line px-2 py-1.5 text-xs"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="flex items-center gap-1 text-xs text-mute transition-colors hover:text-ink"
        >
          <StickyNote size={12} /> Add note
        </button>
      )}

      <div className="flex items-center justify-between text-[11px] text-mute">
        <span>
          {shortlisted ? "Found" : "Applied"} {age === 0 ? "today" : `${age}d ago`}
        </span>
        {job.apply_link && (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium text-ink hover:underline"
          >
            Open <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropTarget, setDropTarget] = useState(null);
  const [kitJob, setKitJob] = useState(null);
  const toast = useToast();

  const saveKit = useCallback(
    (kit) => setJobs((prev) => prev.map((j) => (j.id === kitJob?.id ? { ...j, kit } : j))),
    [kitJob?.id]
  );

  useEffect(() => {
    API.get("/jobs/applied")
      .then((res) => setJobs(res.data.applied_jobs || []))
      .catch(() => toast.error("Could not load your applications."))
      .finally(() => setLoading(false));
  }, [toast]);

  const updateJob = async (id, changes) => {
    const previous = jobs;
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...changes } : j)));
    try {
      const res = await API.patch(`/jobs/applied/${id}`, changes);
      setJobs((prev) => prev.map((j) => (j.id === id ? res.data.job : j)));
      if (changes.status) toast.success(`Moved to ${STAGES.find((s) => s.id === changes.status).label}`);
    } catch {
      setJobs(previous);
      toast.error("Could not update this application.");
    }
  };

  const deleteJob = async (job) => {
    const ok = await toast.confirm({
      title: "Remove this application?",
      message: `${job.title} at ${job.company} will be removed from your tracker.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    const previous = jobs;
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
    try {
      await API.delete(`/jobs/applied/${job.id}`);
      toast.success("Application removed");
    } catch {
      setJobs(previous);
      toast.error("Could not remove this application.");
    }
  };

  const count = (status) => jobs.filter((j) => j.status === status).length;
  const tracked = jobs.length - count("shortlisted");
  const responded = tracked - count("applied");
  const reminders = jobs.filter(reminderFor);
  const stats = [
    { label: "Applications", value: tracked },
    { label: "Response rate", value: tracked ? `${Math.round((100 * responded) / tracked)}%` : "-" },
    { label: "Interviews", value: count("interview") + count("offer") },
    { label: "Offers", value: count("offer") },
  ];

  return (
    <div className="min-h-[100dvh]">
      <Nav />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 md:py-16">
        <div>
          <h1 className="text-4xl font-semibold md:text-5xl">Tracker</h1>
          <p className="mt-3 text-lg text-graphite">Drag applications between stages as you hear back.</p>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-[20px] bg-ink text-white md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} index={i} className="border-white/10 p-6 odd:border-r md:border-r md:last:border-r-0">
              <p className="font-display text-4xl font-semibold">{loading ? "-" : s.value}</p>
              <p className="mt-1 text-sm text-white/60">{s.label}</p>
            </Reveal>
          ))}
        </div>

        {reminders.length > 0 && (
          <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 flex items-center gap-2 font-sans text-base font-semibold tracking-normal text-amber-900">
              <Bell size={16} /> Reminders
            </h2>
            <ul className="space-y-1 text-sm text-amber-900">
              {reminders.map((j) => <li key={j.id}>{j.title} at {j.company}: {reminderFor(j)}</li>)}
            </ul>
          </div>
        )}

        {!loading && jobs.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-semibold">No applications yet</p>
            <p className="mt-2 text-graphite">
              Press Mark on any job listing, or set a daily alert on the Jobs page to get matches here automatically.
            </p>
            <Link to="/jobs" className="btn btn-primary mt-6">Find jobs</Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {STAGES.map((stage) => (
              <section
                key={stage.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTarget(stage.id);
                }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={(e) => {
                  setDropTarget(null);
                  const id = e.dataTransfer.getData("text/plain");
                  const job = jobs.find((j) => j.id === id);
                  if (job && job.status !== stage.id) updateJob(id, { status: stage.id });
                }}
                className={`min-h-40 rounded-[20px] border p-3 transition-colors ${
                  dropTarget === stage.id ? "border-ink bg-neutral-100" : "border-line bg-neutral-50"
                }`}
              >
                <h3 className="mb-3 flex justify-between px-1 font-sans text-sm font-semibold tracking-normal">
                  {stage.label}
                  <span className="text-mute">{count(stage.id)}</span>
                </h3>
                <div className="space-y-3">
                  {loading && stage.id === "shortlisted" && <div className="skeleton h-28 rounded-xl" />}
                  {jobs
                    .filter((j) => j.status === stage.id)
                    .map((job) => (
                      <JobCard key={job.id} job={job} onUpdate={updateJob} onDelete={deleteJob} onPrepare={setKitJob} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {kitJob && (
        <ApplicationKitModal
          job={kitJob}
          trackedJobId={kitJob.id}
          onSaved={saveKit}
          onClose={() => setKitJob(null)}
        />
      )}
    </div>
  );
}

export default AppliedJobs;
