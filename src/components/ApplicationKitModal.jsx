import { useEffect, useState } from "react";
import API, { apiError } from "../api";
import Modal, { CopyButton, ModalSkeleton } from "./Modal";

function Block({ title, text, dark = false }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-sans text-sm font-semibold tracking-normal">{title}</h3>
        <CopyButton text={text} />
      </div>
      <p
        className={`rounded-xl p-4 leading-6 whitespace-pre-line ${
          dark ? "bg-ink text-white" : "border border-line text-ink"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

// trackedJobId: pass it for tracker cards so the kit is saved on the card.
export default function ApplicationKitModal({ job, trackedJobId, onSaved, onClose }) {
  const [kit, setKit] = useState(job.kit || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (job.kit) return;
    const body = trackedJobId
      ? { job_id: trackedJobId }
      : { title: job.title || "", company: job.company || "", job_description: job.description || "" };
    API.post("/resume/application-kit", body)
      .then((res) => {
        setKit(res.data);
        onSaved?.(res.data);
      })
      .catch((err) => setError(apiError(err, "Could not prepare the application. Try again in a moment.")));
  }, [job, trackedJobId, onSaved]);

  return (
    <Modal title="Application kit" subtitle={`${job.title} at ${job.company}`} onClose={onClose}>
      {!kit && !error && <ModalSkeleton label="Writing your cover letter and answers" />}

      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

      {kit && (
        <div className="page-enter space-y-6 text-sm">
          <Block title="Cover letter" text={kit.cover_letter} dark />
          {kit.recruiter_message && <Block title="Message to the recruiter" text={kit.recruiter_message} />}

          <div className="space-y-4">
            <h3 className="font-sans text-sm font-semibold tracking-normal">Application answers</h3>
            {kit.answers.map((a) => (
              <div key={a.question} className="rounded-xl border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{a.question}</p>
                  <CopyButton text={a.answer} />
                </div>
                <p className="mt-2 leading-6 text-graphite">{a.answer}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-mute">
            Written from your resume. Read it through and adjust anything before you send it.
          </p>
        </div>
      )}
    </Modal>
  );
}
