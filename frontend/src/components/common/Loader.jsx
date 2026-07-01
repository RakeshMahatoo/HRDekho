import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link to="/feed" className="text-lg font-bold text-white">
        Naukri
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/feed" className="text-sm text-gray-300 hover:text-white">
          Feed
        </Link>
        <Link to="/community" className="text-sm text-gray-300 hover:text-white">
          Community
        </Link>
        <Link to="/companies" className="text-sm text-gray-300 hover:text-white">
          Companies
        </Link>
        <Link to="/saved" className="text-sm text-gray-300 hover:text-white">
          Saved
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;