import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

const LINKS = [
  ["/dashboard", "Dashboard"],
  ["/jobs", "Jobs"],
  ["/mock-interview", "Mock interview"],
  ["/applied-jobs", "Tracker"],
  ["/prep-history", "History"],
];

const pill = ({ isActive }) =>
  `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
    isActive ? "bg-ink text-white" : "text-graphite hover:bg-neutral-100 hover:text-ink"
  }`;

function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/dashboard" className="shrink-0 font-display text-xl font-semibold">
          PrepMate
        </Link>

        <nav className="hidden flex-1 gap-1 md:flex">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} className={pill}>
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={logout} className="btn btn-ghost btn-sm hidden shrink-0 md:inline-flex">
          <LogOut size={15} /> Log out
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="btn btn-ghost btn-sm ml-auto size-10 p-0 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 top-16 bg-black/20 md:hidden" onClick={() => setOpen(false)} />
          <nav className="dialog absolute inset-x-0 top-full border-b border-line bg-white px-4 pt-3 pb-5 shadow-lg md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `${pill({ isActive })} px-4 py-3 text-base`}
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <button type="button" onClick={logout} className="btn btn-secondary mt-4 w-full">
              <LogOut size={16} /> Log out
            </button>
          </nav>
        </>
      )}
    </header>
  );
}

export default Nav;
