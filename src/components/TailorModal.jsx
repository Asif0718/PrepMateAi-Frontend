import { useEffect, useState } from "react";
import API, { apiError } from "../api";
import Modal, { CopyButton, ModalSkeleton } from "./Modal";

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

  return (
    <Modal title="Tailor resume" subtitle={`${job.title} at ${job.company}`} onClose={onClose}>
      {!result && !error && <ModalSkeleton label="Rewriting your resume for this job" />}

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
    </Modal>
  );
}
