import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Your Password"
            />
          </div>

          <div style={{ textAlign: "right" }}>
            <Link
              to="/forgot-password"
              className="text-sm"
              style={{ color: "#60A5FA" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#374151" }} />
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#374151" }} />
        </div>

        <a
          href="http://localhost:5000/api/auth/google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "10px",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "#E5E7EB",
            textDecoration: "none",
            background: "#1F2937",
            cursor: "pointer",
          }}
        >
          <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
          Continue with Google
        </a>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;