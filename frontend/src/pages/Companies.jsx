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
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Companies
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Browse HR contacts grouped by company
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company name..."
            className="w-full rounded-xl pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                    <div className="flex gap-1.5 pt-1">
                      <div className="h-5 w-16 bg-slate-100 rounded-full" />
                      <div className="h-5 w-14 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M9 7h6M9 11h6M9 15h4" />
              </svg>
            </div>
            <p className="text-base font-medium text-slate-900 mb-1">
              No companies found
            </p>
            <p className="text-sm text-slate-500">
              {search ? "Try a different search term" : "Companies will appear here once shared"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${encodeURIComponent(company._id)}`}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  {company._id.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate group-hover:text-indigo-600 transition">
                    {company._id}
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-1 text-slate-500">
                    <span className="truncate">{company.cities.join(", ")}</span>
                    <span className="text-slate-300">·</span>
                    <span className="whitespace-nowrap">{company.contactsCount} contacts</span>
                  </div>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {company.roles.map((role) => (
                      <span
                        key={role}
                        className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition flex-shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Companies;
