import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import CommunityPostCard from "../components/community/CommunityPostCard";

const FILTERS = [
  { value: "", label: "All" },
  { value: "text", label: "✏️ Text" },
  { value: "image", label: "🖼️ Image" },
  { value: "video", label: "🎥 Video" },
  { value: "resume", label: "📄 Resume" },
];

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/community", {
        params: activeFilter ? { type: activeFilter } : {},
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold" style={{ color: "var(--text)" }}>
              Community
            </h1>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Share your experience, resume, or tips
            </p>
          </div>
          <Link
            to="/community/create"
            className="text-sm font-medium px-4 py-2 rounded-full transition"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            + Post
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className="text-xs px-3 py-1.5 rounded-full transition"
              style={{
                background: activeFilter === f.value ? "var(--accent)" : "var(--surface)",
                color: activeFilter === f.value ? "var(--bg)" : "var(--text-dim)",
                border: `1px solid ${activeFilter === f.value ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center py-10 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading...
          </p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg mb-1" style={{ color: "var(--text)" }}>
              No posts yet
            </p>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Be the first to share something
            </p>
          </div>
        ) : (
          posts.map((post) => <CommunityPostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Community;