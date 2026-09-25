import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const LINKS = [
  ["/dashboard", "Dashboard"],
  ["/jobs", "Jobs"],
  ["/mock-interview", "Mock interview"],
  ["/applied-jobs", "Tracker"],
  ["/prep-history", "History"],
];

function Nav() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/dashboard" className="shrink-0 font-display text-xl font-semibold">
          PrepMate
        </Link>

        <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-ink text-white" : "text-graphite hover:bg-neutral-100 hover:text-ink"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={logout} className="btn btn-ghost btn-sm shrink-0">
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}

export default Nav;
