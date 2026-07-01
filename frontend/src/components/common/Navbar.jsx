import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav
      className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between backdrop-blur-md"
      style={{ background: "#0B0E14CC", borderBottom: "1px solid var(--border)" }}
    >
      <Link to="/feed" className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
        <span className="font-display font-semibold text-lg tracking-tight" style={{ color: "var(--text)" }}>
          naukri
        </span>
      </Link>

      <div className="flex items-center gap-1 px-1 py-1 rounded-full" style={{ background: "var(--surface)" }}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm px-4 py-1.5 rounded-full transition"
            style={{
              color: location.pathname === link.to ? "var(--bg)" : "var(--text-dim)",
              background: location.pathname === link.to ? "var(--accent)" : "transparent",
              fontWeight: location.pathname === link.to ? 600 : 500,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: "var(--text-dim)" }}>
          {user?.name}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-full border transition hover:opacity-80"
          style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;