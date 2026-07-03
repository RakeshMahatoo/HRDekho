import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Check your email</h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
              If <strong>{email}</strong> is registered, we've sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link to="/login" style={{ color: "#1A56DB", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              ← Back to login
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Forgot password?</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6, display: "block" }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", background: "#1A56DB", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>

            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 20, textAlign: "center" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ color: "#1A56DB", fontWeight: 500, textDecoration: "none" }}>
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;