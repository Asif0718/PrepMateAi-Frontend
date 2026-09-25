import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, FileText, UploadCloud } from "lucide-react";
import API, { apiError } from "../api";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import { useToast } from "../components/toast-context";

const STATUS = ["Reading your resume", "Comparing it with the job", "Writing your 7-day guide"];

const SHORTCUTS = [
  ["/jobs", "Find jobs", "Listings ranked by how well they match your skills."],
  ["/mock-interview", "Mock interview", "Practise role-specific questions and get scored."],
  ["/applied-jobs", "Tracker", "Every application, by stage, with reminders."],
];

function Dashboard() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    API.get("/auth/me").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setStatus((s) => Math.min(s + 1, STATUS.length - 1)), 6000);
    return () => clearInterval(timer);
  }, [loading]);

  const pickFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Upload your resume as a PDF file.");
      return;
    }
    setResume(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Add your resume PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      setStatus(0);
      setLoading(true);
      const res = await API.post("/resume/upload", formData);
      localStorage.setItem("preparationGuide", res.data.preparation_guide);
      toast.success("Your preparation guide is ready");
      navigate("/preparation-guide");
    } catch (err) {
      toast.error(apiError(err, "Could not generate the guide. Try again in a moment."));
    } finally {
      setLoading(false);
    }
  };

  const firstName = profile?.name?.split(" ")[0];

  return (
    <div className="min-h-[100dvh]">
      <Nav />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="text-4xl font-semibold md:text-5xl">
          {firstName ? `Hi ${firstName}, what's the next role?` : "What's the next role?"}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-graphite">
          Upload your resume and the job description to get a personalised{" "}
          <span className="whitespace-nowrap">7-day</span> preparation guide.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={handleUpload} className="card space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <span className="label">Resume</span>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  pickFile(e.dataTransfer.files[0]);
                }}
                className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
                  dragging ? "border-ink bg-neutral-100" : "border-line hover:border-graphite"
                }`}
              >
                {resume ? (
                  <FileText size={32} strokeWidth={1.5} />
                ) : (
                  <UploadCloud size={32} strokeWidth={1.5} className="text-graphite" />
                )}
                <span className="font-medium">
                  {resume ? resume.name : "Drop your PDF here or click to browse"}
                </span>
                <span className="text-sm text-mute">
                  {resume ? "Click to choose a different file" : "PDF only"}
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => pickFile(e.target.files[0])}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="jd" className="label">Job description</label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
                rows={5}
                placeholder="Paste the full job description"
                className="field resize-none"
                data-lenis-prevent
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? `${STATUS[status]}...` : "Generate preparation guide"}
            </button>
            {loading && (
              <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
                <div className="skeleton h-full w-full" />
              </div>
            )}
          </form>

          <div className="space-y-6">
            <Reveal className="card p-6">
              <h2 className="text-xl font-semibold">Your skills</h2>
              {profile?.resume_skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.resume_skills.slice(0, 18).map((skill) => (
                    <span key={skill} className="chip">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-graphite">
                  Upload a resume once and we will pull out your skills for job matching.
                </p>
              )}
            </Reveal>

            <Reveal index={1} className="overflow-hidden rounded-[20px] bg-ink text-white">
              {SHORTCUTS.map(([to, title, body]) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-start justify-between gap-4 border-t border-white/10 p-6 transition-colors first:border-t-0 hover:bg-white/5"
                >
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-white/60">{body}</p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  />
                </Link>
              ))}
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
