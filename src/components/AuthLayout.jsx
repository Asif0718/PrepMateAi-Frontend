import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({ id, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={visible ? "text" : "password"} className="field pr-12" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-mute transition-colors hover:text-ink"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default function AuthLayout({ headline, subtext, children }) {
  return (
    <div className="grid min-h-[100dvh] md:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white md:flex">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=70"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <Link to="/" className="relative font-display text-2xl font-semibold">
          PrepMate
        </Link>
        <div className="relative max-w-md">
          <h1 className="text-5xl leading-[1.05] font-semibold lg:text-6xl">
            {headline.split(" ").map((word, i) => (
              <span key={i} className="rise-line mr-[0.25em]">
                <span style={{ "--i": i }}>{word}</span>
              </span>
            ))}
          </h1>
          <p className="mt-5 text-lg text-white/70">{subtext}</p>
        </div>
      </aside>

      <main className="relative flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 block font-display text-2xl font-semibold md:hidden">
            PrepMate
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
