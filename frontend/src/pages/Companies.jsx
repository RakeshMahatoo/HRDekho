import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/hrposts/companies/list");
      setCompanies(res.data.companies);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter((c) =>
    c._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>
          Companies
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>
          Browse HR contacts grouped by company
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company name..."
          className="w-full rounded-full px-5 py-2.5 text-sm outline-none mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        />

        {loading ? (
          <p className="text-center py-10 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: "var(--text-dim)" }}>
            No companies found
          </p>
        ) : (
          filtered.map((company) => (
            <Link
              key={company._id}
              to={`/companies/${encodeURIComponent(company._id)}`}
              className="flex items-center gap-4 rounded-2xl p-4 mb-3 transition"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-semibold flex-shrink-0"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {company._id.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display font-medium text-sm" style={{ color: "var(--text)" }}>
                  {company._id}
                </p>
                <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                  <span>{company.cities.join(", ")}</span>
                  <span>·</span>
                  <span>{company.contactsCount} contacts shared</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {company.roles.map((role) => (
                    <span
                      key={role}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <span style={{ color: "var(--text-dim)" }}>→</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Companies;