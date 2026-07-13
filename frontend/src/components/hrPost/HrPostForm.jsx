import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ROLES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data", "Design", "Mobile", "Other"];

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
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
      {children} {required && <span className="text-indigo-500">*</span>}
    </label>
  );

  const inputClass =
    "w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-5">
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
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
            placeholder="e.g. Google"
            className={inputClass}
          />
        </div>
        <div>
          <Label required>HR name</Label>
          <input
            name="hrName"
            value={form.hrName}
            onChange={handleChange}
            placeholder="e.g. Priya Sharma"
            className={inputClass}
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
            className={inputClass}
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
            placeholder="e.g. Senior Frontend Engineer"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City / remote</Label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Bangalore / Remote"
            className={inputClass}
          />
        </div>
        <div>
          <Label>HR phone number</Label>
          <input
            name="hrPhone"
            value={form.hrPhone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <Label>Job description</Label>
        <textarea
          name="jobDescription"
          value={form.jobDescription}
          onChange={handleChange}
          rows={3}
          placeholder="Briefly describe the role and responsibilities"
          className={`${inputClass} resize-none`}
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
          className={`${inputClass} resize-none`}
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
            className={inputClass}
          />
        </div>
        <div>
          <Label>Company website (optional)</Label>
          <input
            name="companyWebsite"
            value={form.companyWebsite}
            onChange={handleChange}
            placeholder="careers.company.com"
            className={inputClass}
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
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Sharing..." : "Share contact"}
      </button>
    </form>
  );
};

export default HrPostForm;
