import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";

export function CopyButton({ text }) {
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

export function ModalSkeleton({ label }) {
  return (
    <div className="space-y-3" aria-label={label}>
      <div className="skeleton h-4 w-11/12" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton mt-6 h-20 w-full rounded-xl" />
      <div className="skeleton h-16 w-full rounded-xl" />
    </div>
  );
}

export default function Modal({ title, subtitle, onClose, children }) {
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
        aria-labelledby="modal-title"
        className="dialog max-h-[85dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[20px] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="btn btn-ghost btn-sm px-2.5">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
