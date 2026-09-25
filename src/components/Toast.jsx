import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastContext } from "./toast-context";

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info };

function ConfirmDialog({ dialog, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="overlay fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      onClick={() => onClose(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="dialog w-full max-w-sm rounded-[20px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-xl font-semibold">{dialog.title}</h2>
        {dialog.message && <p className="mt-2 text-sm text-graphite">{dialog.message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" autoFocus onClick={() => onClose(true)}>
            {dialog.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), 300);
  }, []);

  const show = useCallback(
    (type, message) => {
      const id = ++nextId.current;
      setToasts((all) => [...all.slice(-2), { id, type, message }]);
      setTimeout(() => dismiss(id), type === "error" ? 5000 : 3500);
    },
    [dismiss]
  );

  const closeDialog = useCallback((result) => {
    setDialog((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  const api = useMemo(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      info: (message) => show("info", message),
      confirm: (options) => new Promise((resolve) => setDialog({ ...options, resolve })),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 left-4 z-[80] flex flex-col items-end gap-2 sm:left-auto"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              role={t.type === "error" ? "alert" : "status"}
              className={`toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-xl ${
                t.type === "error" ? "bg-white text-ink ring-1 ring-ink" : "bg-ink text-white"
              } ${t.leaving ? "is-leaving" : ""}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1">{t.message}</p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {dialog && <ConfirmDialog dialog={dialog} onClose={closeDialog} />}
    </ToastContext.Provider>
  );
}
