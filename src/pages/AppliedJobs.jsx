import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays, ExternalLink, StickyNote, Trash2 } from "lucide-react";
import API from "../api";
import Nav from "../components/Nav";

const STAGES = [
  { id: "applied", label: "Applied", color: "border-t-indigo-500" },
  { id: "online_test", label: "Online Test", color: "border-t-sky-500" },
  { id: "interview", label: "Interview", color: "border-t-amber-500" },
  { id: "offer", label: "Offer", color: "border-t-emerald-500" },
  { id: "rejected", label: "Rejected", color: "border-t-gray-400" },
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

function JobCard({ job, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(job.notes);
  const [showNotes, setShowNotes] = useState(Boolean(job.notes));
  const reminder = reminderFor(job);

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", job.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 space-y-2 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{job.title}</h4>
          <p className="text-xs text-gray-500 truncate">{job.company} · {job.location}</p>
        </div>
        <button type="button" onClick={() => onDelete(job.id)} className="text-gray-300 hover:text-red-500 shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      {reminder && (
        <p className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg px-2 py-1">
          <Bell size={12} /> {reminder}
        </p>
      )}

      <select
        value={job.status}
        onChange={(e) => onUpdate(job.id, { status: e.target.value })}
        className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 bg-gray-50"
      >
        {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>

      {["online_test", "interview"].includes(job.status) && (
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <CalendarDays size={13} />
          <input
            type="date"
            value={job.interview_date || ""}
            onChange={(e) => onUpdate(job.id, { interview_date: e.target.value })}
            className="flex-1 rounded-lg border border-gray-200 px-2 py-1"
          />
        </label>
      )}

      {showNotes ? (
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== job.notes && onUpdate(job.id, { notes })}
          placeholder="Notes: recruiter name, round details..."
          className="w-full text-xs rounded-lg border border-gray-200 px-2 py-1.5 resize-none"
        />
      ) : (
        <button type="button" onClick={() => setShowNotes(true)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600">
          <StickyNote size={12} /> Add note
        </button>
      )}

      <div className="flex justify-between items-center text-[11px] text-gray-400">
        <span>Applied {daysSince(job.applied_at) === 0 ? "today" : `${daysSince(job.applied_at)}d ago`}</span>
        {job.apply_link && (
          <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
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

  useEffect(() => {
    API.get("/jobs/applied")
      .then((res) => setJobs(res.data.applied_jobs || []))
      .catch((err) => console.log(err.response?.data || err))
      .finally(() => setLoading(false));
  }, []);

  const updateJob = async (id, changes) => {
    const previous = jobs;
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...changes } : j)));
    try {
      const res = await API.patch(`/jobs/applied/${id}`, changes);
      setJobs((prev) => prev.map((j) => (j.id === id ? res.data.job : j)));
    } catch {
      setJobs(previous);
      alert("Could not update this application");
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Remove this application from your tracker?")) return;
    const previous = jobs;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      await API.delete(`/jobs/applied/${id}`);
    } catch {
      setJobs(previous);
    }
  };

  const count = (status) => jobs.filter((j) => j.status === status).length;
  const responded = jobs.filter((j) => j.status !== "applied").length;
  const reminders = jobs.filter(reminderFor);
  const stats = [
    { label: "Total applications", value: jobs.length },
    { label: "Response rate", value: jobs.length ? `${Math.round((100 * responded) / jobs.length)}%` : "-" },
    { label: "Interviews", value: count("interview") + count("offer") },
    { label: "Offers", value: count("offer") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Nav subtitle="Track every application" showBack backTo="/jobs" centerTitle />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/85 rounded-2xl shadow p-4">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {reminders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="flex items-center gap-2 font-semibold text-amber-800 mb-2">
              <Bell size={16} /> Reminders
            </h3>
            <ul className="text-sm text-amber-900 space-y-1">
              {reminders.map((j) => <li key={j.id}>{j.title} at {j.company}: {reminderFor(j)}</li>)}
            </ul>
          </div>
        )}

        {!loading && jobs.length === 0 ? (
          <div className="bg-white/85 rounded-2xl shadow p-10 text-center text-gray-600">
            No applications yet. <Link to="/jobs" className="text-indigo-600 font-semibold underline">Find jobs</Link> and press "Mark" to track them here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {STAGES.map((stage) => (
              <section
                key={stage.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData("text/plain");
                  const job = jobs.find((j) => j.id === id);
                  if (job && job.status !== stage.id) updateJob(id, { status: stage.id });
                }}
                className={`bg-white/60 rounded-2xl border-t-4 ${stage.color} p-3 min-h-40`}
              >
                <h3 className="flex justify-between font-semibold text-gray-800 text-sm mb-3 px-1">
                  {stage.label}
                  <span className="text-gray-400">{count(stage.id)}</span>
                </h3>
                <div className="space-y-3">
                  {jobs
                    .filter((j) => j.status === stage.id)
                    .map((job) => (
                      <JobCard key={job.id} job={job} onUpdate={updateJob} onDelete={deleteJob} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AppliedJobs;
