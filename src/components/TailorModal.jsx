import { useEffect, useState } from "react";
import { Copy, Loader2, X } from "lucide-react";
import API, { apiError } from "../api";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
    >
      <Copy size={12} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

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
      .catch((err) => setError(apiError(err, "Could not tailor resume")));
  }, [job]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tailor resume</h2>
            <p className="text-sm text-gray-500">
              {job.title} at {job.company}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {!result && !error && (
          <div className="flex items-center gap-3 text-gray-600 py-10 justify-center">
            <Loader2 className="animate-spin" size={20} />
            Rewriting your resume for this job...
          </div>
        )}

        {error && <p className="text-red-600 bg-red-50 rounded-xl p-4">{error}</p>}

        {result && (
          <div className="space-y-5 text-sm">
            <p className="text-gray-700 leading-6">{result.match_summary}</p>

            {result.missing_keywords.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Missing keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((k) => (
                    <span key={k} className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.improved_summary && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Tailored summary</h3>
                  <CopyButton text={result.improved_summary} />
                </div>
                <p className="bg-indigo-50 rounded-xl p-3 text-gray-800 leading-6">
                  {result.improved_summary}
                </p>
              </div>
            )}

            {result.bullet_rewrites.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Improved bullet points</h3>
                <div className="space-y-3">
                  {result.bullet_rewrites.map((b, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-3">
                      {b.original && <p className="text-gray-400 line-through">{b.original}</p>}
                      <div className="flex items-start justify-between gap-3 mt-1">
                        <p className="text-gray-800">{b.improved}</p>
                        <CopyButton text={b.improved} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.tips.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
                <ul className="list-disc ml-5 space-y-1 text-gray-700">
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
