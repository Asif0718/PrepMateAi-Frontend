import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import API, { apiError } from "../api";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" onClick={copy} className="btn btn-ghost btn-sm shrink-0 px-2.5 py-1">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const heading = "mb-2 font-sans text-sm font-semibold tracking-normal";

export default function TailorModal({ job, onClose }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.post("/resume/tailor", {
      job_description: `${job.title || ""}\n${job.description || ""}`,
      title: job.title || "",
      company: job.company || "",
    })
      .then((res) => setResult(res.data))
      .catch((err) => setError(apiError(err, "Could not tailor your resume. Try again in a moment.")));
  }, [job]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="overlay fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tailor-title"
        className="dialog max-h-[85dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[20px] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="tailor-title" className="text-2xl font-semibold">Tailor resume</h2>
            <p className="mt-1 text-sm text-mute">
              {job.title} at {job.company}
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="btn btn-ghost btn-sm px-2.5">
            <X size={18} />
          </button>
        </div>

        {!result && !error && (
          <div className="space-y-3" aria-label="Rewriting your resume for this job">
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton mt-6 h-20 w-full rounded-xl" />
            <div className="skeleton h-16 w-full rounded-xl" />
          </div>
        )}

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

        {result && (
          <div className="page-enter space-y-6 text-sm">
            <p className="leading-6 text-graphite">{result.match_summary}</p>

            {result.missing_keywords.length > 0 && (
              <div>
                <h3 className={heading}>Missing keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((k) => (
                    <span key={k} className="chip border-dashed">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {result.improved_summary && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className={`${heading} mb-0`}>Tailored summary</h3>
                  <CopyButton text={result.improved_summary} />
                </div>
                <p className="rounded-xl bg-ink p-4 leading-6 text-white">{result.improved_summary}</p>
              </div>
            )}

            {result.bullet_rewrites.length > 0 && (
              <div>
                <h3 className={heading}>Improved bullet points</h3>
                <div className="space-y-3">
                  {result.bullet_rewrites.map((b, i) => (
                    <div key={i} className="rounded-xl border border-line p-4">
                      {b.original && <p className="text-mute line-through">{b.original}</p>}
                      <div className="mt-1 flex items-start justify-between gap-3">
                        <p>{b.improved}</p>
                        <CopyButton text={b.improved} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.tips.length > 0 && (
              <div>
                <h3 className={heading}>Tips</h3>
                <ul className="ml-5 list-disc space-y-1 text-graphite">
                  {result.tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
