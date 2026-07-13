import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

const STATUS_OPTIONS = [
  { value: "saved", label: "Saved" },
  { value: "contacted", label: "Contacted" },
  { value: "applied", label: "Applied" },
];

const Saved = () => {
  const [saves, setSaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchSaves();
  }, []);

  const fetchSaves = async () => {
    try {
      const res = await api.get("/saves/my");
      setSaves(res.data.saves);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (postType, postId, status) => {
    try {
      await api.patch(`/saves/${postType}/${postId}/status`, { status });
      setSaves((prev) =>
        prev.map((s) => (s.postId?._id === postId ? { ...s, status } : s))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeSave = async (postType, postId) => {
    try {
      await api.post(`/saves/${postType}/${postId}`);
      setSaves((prev) => prev.filter((s) => s.postId?._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "saved", label: "Saved" },
    { key: "contacted", label: "Contacted" },
    { key: "applied", label: "Applied" },
  ];

  const filtered =
    activeTab === "all" ? saves : saves.filter((s) => s.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-semibold mb-1 text-slate-900">
          Saved
        </h1>
        <p className="text-sm mb-6 text-slate-500">
          Track contacts you've saved, contacted, or applied to
        </p>

        <div className="flex gap-1 p-1 rounded-full mb-6 w-fit bg-white border border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs px-4 py-1.5 rounded-full transition font-medium ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-transparent text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-10 text-sm text-slate-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg mb-1 text-slate-900">
              Nothing here yet
            </p>
            <p className="text-sm text-slate-500">
              Save a post from the feed to track it here
            </p>
          </div>
        ) : (
          filtered.map((save) => {
            const post = save.postId;
            if (!post) return null;

            return (
              <div
                key={save._id}
                className="rounded-2xl p-4 mb-3 bg-white border border-slate-200 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <Link to={`/post/hr/${post._id}`} className="min-w-0">
                    <p className="font-display font-medium text-sm text-slate-900">
                      {post.companyName} · {post.jobTitle || post.text?.slice(0, 30)}
                    </p>
                    <p className="text-xs mt-0.5 text-slate-500">
                      {post.hrName && `HR: ${post.hrName} · `}
                      {post.city}
                    </p>
                  </Link>
                  <button
                    onClick={() => removeSave(save.postType, post._id)}
                    className="text-xs flex-shrink-0 text-slate-500 hover:text-slate-700 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => {
                    const isActive = save.status === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateStatus(save.postType, post._id, opt.value)}
                        className={`text-xs px-3 py-1 rounded-full transition ${
                          isActive
                            ? "bg-indigo-50 text-indigo-600 border border-indigo-600"
                            : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Saved;
