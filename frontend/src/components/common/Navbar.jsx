import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/feed", label: "Feed" },
    { to: "/community", label: "Community" },
    { to: "/companies", label: "Companies" },
    { to: "/saved", label: "Saved" },
    { to: "/profile", label: "Profile" },
  ];

  const isActive = (to) => location.pathname === to;

  const initials =
    (user?.name || "U")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2 shrink-0">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/25">
              n
            </span>
            <span className="font-display font-semibold text-lg tracking-tight text-slate-900">
              naukri
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "text-sm px-4 py-1.5 rounded-full transition-all duration-200 " +
                  (isActive(link.to)
                    ? "bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/25"
                    : "text-slate-600 font-medium hover:text-slate-900")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User + actions (desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                {initials}
              </span>
              <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
                {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-slate-200 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="flex flex-col gap-1 pt-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={
                    "text-sm px-4 py-2.5 rounded-lg transition " +
                    (isActive(link.to)
                      ? "bg-indigo-600 text-white font-semibold"
                      : "text-slate-700 font-medium hover:bg-slate-100")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
                  {initials}
                </span>
                <span className="text-sm font-medium text-slate-700 truncate">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="shrink-0 text-xs font-medium px-3 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
