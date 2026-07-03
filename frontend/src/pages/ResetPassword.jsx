import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8FAFC" }}>
      <div className="w-full max-w-md bg-white rounded-2xl p-8" style={{ border: "1px solid #E5E7EB" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, background: "#1A56DB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>D</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>DekhoHR</span>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Password reset!</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Set new password</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
              Enter your new password below.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6, display: "block" }}>New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6, display: "block" }}>Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", background: "#1A56DB", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Resetting..." : "Reset password"}
              </button>
            </form>

            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 20, textAlign: "center" }}>
              <Link to="/login" style={{ color: "#1A56DB", fontWeight: 500, textDecoration: "none" }}>
                ← Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;