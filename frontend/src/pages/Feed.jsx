import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import HrPostCard from "../components/hrpost/HrPostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await api.get("/hrposts", {
        params: searchTerm ? { search: searchTerm } : {},
      });
      setPosts(res.data.hrPosts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold" style={{ color: "var(--text)" }}>
              Feed
            </h1>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Verified HR contacts, shared by the community
            </p>
          </div>
          <Link
            to="/create-post"
            className="text-sm font-medium px-4 py-2 rounded-full transition"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            + Share contact
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, role, city..."
            className="w-full rounded-full px-5 py-2.5 text-sm outline-none transition"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </form>

        {loading ? (
          <p className="text-center py-10 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading posts...
          </p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg mb-1" style={{ color: "var(--text)" }}>
              No contacts shared yet
            </p>
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>
              Be the first to help the community
            </p>
          </div>
        ) : (
          posts.map((post) => <HrPostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Feed;