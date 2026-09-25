import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import API, { apiError } from "../api";
import Nav from "../components/Nav";
import Reveal from "../components/Reveal";
import { useToast } from "../components/toast-context";

const formatDate = (value) => {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

function PrepHistory() {
  const [history, setHistory] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    API.get("/resume/history")
      .then((res) => setHistory(res.data.history || []))
      .catch((err) => {
        setHistory(false);
        toast.error(apiError(err, "Could not load your history."));
      });
  }, [toast]);

  const openGuide = (guide) => {
    localStorage.setItem("preparationGuide", guide);
    navigate("/preparation-guide");
  };

  const remove = async (item) => {
    const ok = await toast.confirm({
      title: "Delete this guide?",
      message: `The guide for ${item.resume_file} will be removed from your history.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await API.delete(`/resume/history/${item.id}`);
      setHistory((all) => all.filter((h) => h.id !== item.id));
      toast.success("Guide deleted");
    } catch (err) {
      toast.error(apiError(err, "Could not delete the guide."));
    }
  };

  return (
    <div className="min-h-[100dvh]">
      <Nav />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="text-4xl font-semibold md:text-5xl">History</h1>
        <p className="mt-3 text-lg text-graphite">Every preparation guide you have generated.</p>

        <div className="mt-10 space-y-3">
          {history === null &&
            [0, 1, 2].map((i) => <div key={i} className="skeleton h-24 rounded-[20px]" />)}

          {history === false && (
            <div className="card p-10 text-center">
              <p className="text-lg font-semibold">Your history did not load</p>
              <p className="mt-2 text-graphite">Check your connection, then reload the page.</p>
              <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6">
                Reload
              </button>
            </div>
          )}

          {history?.length === 0 && (
            <div className="card p-10 text-center">
              <p className="text-lg font-semibold">No guides yet</p>
              <p className="mt-2 text-graphite">Your guides will appear here after your first upload.</p>
              <Link to="/dashboard" className="btn btn-primary mt-6">Generate a guide</Link>
            </div>
          )}

          {history?.map((item, i) => (
            <Reveal key={item.id} index={Math.min(i, 5)} className="card card-hover flex items-center gap-4 p-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <FileText size={20} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.resume_file}</p>
                <p className="truncate text-sm text-mute">
                  {formatDate(item.uploaded_at)}
                  {item.job_description ? `, ${item.job_description.slice(0, 80)}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => openGuide(item.preparation_guide)} className="btn btn-secondary btn-sm">
                Open guide
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label="Delete guide"
                className="btn btn-ghost btn-sm px-2.5"
              >
                <Trash2 size={16} />
              </button>
            </Reveal>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PrepHistory;
