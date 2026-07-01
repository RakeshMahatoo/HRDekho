import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ROLES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data", "Design", "Mobile", "Other"];

const inputStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text)",
};

const HrPostForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    hrName: "",
    hrPhone: "",
    hrEmail: "",
    role: "Frontend",
    jobTitle: "",
    city: "",
    jobDescription: "",
    interviewQuestions: "",
    salaryRange: "",
    companyWebsite: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/hrposts", form);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children, required }) => (
    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
      {children} {required && <span style={{ color: "var(--warn)" }}>*</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="text-sm rounded-xl px-4 py-2.5"
          style={{ background: "#F5973520", color: "var(--warn)", border: "1px solid var(--warn)" }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label required>Company name</Label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
            placeholder="e.g. Infosys"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <Label required>HR name</Label>
          <input
            name="hrName"
            value={form.hrName}
            onChange={handleChange}
            required
            placeholder="e.g. Priya Mehta"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label required>Role</Label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label required>Job title</Label>
          <input
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            required
            placeholder="e.g. Senior React Developer"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label required>City / remote</Label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="e.g. Bangalore or Remote"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <Label required>HR phone number</Label>
          <input
            name="hrPhone"
            value={form.hrPhone}
            onChange={handleChange}
            required
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <Label required>Job description</Label>
        <textarea
          name="jobDescription"
          value={form.jobDescription}
          onChange={handleChange}
          required
          rows={3}
          placeholder="What does this role involve day-to-day?"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      <div>
        <Label>Interview questions (optional but valuable)</Label>
        <textarea
          name="interviewQuestions"
          value={form.interviewQuestions}
          onChange={handleChange}
          rows={3}
          placeholder="What did they ask you?"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Salary range (optional)</Label>
          <input
            name="salaryRange"
            value={form.salaryRange}
            onChange={handleChange}
            placeholder="e.g. ₹8L - ₹12L"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <Label>Company website (optional)</Label>
          <input
            name="companyWebsite"
            value={form.companyWebsite}
            onChange={handleChange}
            placeholder="careers.company.com"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <Label>HR email (optional)</Label>
        <input
          name="hrEmail"
          value={form.hrEmail}
          onChange={handleChange}
          placeholder="priya@company.com"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-2.5 text-sm font-medium transition disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        {loading ? "Sharing..." : "Share contact"}
      </button>
    </form>
  );
};

export default HrPostForm;