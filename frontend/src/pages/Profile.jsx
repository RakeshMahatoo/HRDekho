import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import HrPostCard from "../components/hrpost/HrPostCard";
import CommunityPostCard from "../components/community/CommunityPostCard";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [bio, setBio] = useState(user?.bio || "");
  const [activeTab, setActiveTab] = useState("hrposts");
  const [hrPosts, setHrPosts] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [openToWork, setOpenToWork] = useState(user?.openToWork || false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const [hrRes, communityRes] = await Promise.all([
        api.get("/hrposts/my/posts"),
        api.get("/community/my/posts"),
      ]);
      setHrPosts(hrRes.data.hrPosts);
      setCommunityPosts(communityRes.data.posts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdating(true);
    try {
      const res = await api.patch("/users/profile", { name, openToWork, bio });
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const tabs = [
    { key: "hrposts", label: "HR Posts", count: hrPosts.length },
    { key: "community", label: "Community", count: communityPosts.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Profile card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {user?.name?.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>
                  {user?.name}
                </h1>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                  >
                    {user?.plan}
                  </span>
                  {user?.openToWork && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#5EEAD420", color: "var(--accent)" }}
                    >
                      Open to work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs px-3 py-1.5 rounded-full transition"
              style={{ background: "var(--surface-2)", color: "var(--text-dim)", border: "1px solid var(--border)" }}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="rounded-xl py-3" style={{ background: "var(--surface-2)" }}>
              <p className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>
                {hrPosts.length}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>HR posts</p>
            </div>
            <div className="rounded-xl py-3" style={{ background: "var(--surface-2)" }}>
              <p className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>
                {communityPosts.length}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>Posts</p>
            </div>
            <div className="rounded-xl py-3" style={{ background: "var(--surface-2)" }}>
              <p className="font-display font-semibold text-lg" style={{ color: "var(--text)" }}>
                {user?.revealsLeft === 999999 ? "∞" : user?.revealsLeft}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>Reveals left</p>
            </div>
          </div>

          {/* Bio display */}
          {user?.bio && !editMode && (
            <div
              className="pt-4 mt-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
                About
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                {user.bio}
              </p>
            </div>
          )}

          {/* Edit form */}
          {editMode && (
            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-3">
              {updateError && (
                <div
                  className="text-sm rounded-xl px-4 py-2.5"
                  style={{ background: "#F5973520", color: "var(--warn)", border: "1px solid var(--warn)" }}
                >
                  {updateError}
                </div>
              )}

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
                  Bio <span style={{ color: "var(--text-dim)" }}>(max 500 characters)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell the community about yourself, your skills, experience..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                />
                <p className="text-xs mt-1 text-right" style={{ color: "var(--text-dim)" }}>
                  {bio.length}/500
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="openToWork"
                  checked={openToWork}
                  onChange={(e) => setOpenToWork(e.target.checked)}
                  className="w-4 h-4 accent-teal-400"
                />
                <label htmlFor="openToWork" className="text-sm" style={{ color: "var(--text)" }}>
                  Open to work
                </label>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full rounded-full py-2 text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                {updating ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-full mb-6 w-fit" style={{ background: "var(--surface)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="text-xs px-4 py-1.5 rounded-full transition"
              style={{
                color: activeTab === tab.key ? "var(--bg)" : "var(--text-dim)",
                background: activeTab === tab.key ? "var(--accent)" : "transparent",
                fontWeight: activeTab === tab.key ? 600 : 500,
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center py-10 text-sm" style={{ color: "var(--text-dim)" }}>
            Loading...
          </p>
        ) : activeTab === "hrposts" ? (
          hrPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-lg mb-1" style={{ color: "var(--text)" }}>
                No HR posts yet
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-dim)" }}>
                Share your first HR contact
              </p>
              <button
                onClick={() => navigate("/create-post")}
                className="text-sm px-4 py-2 rounded-full"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                + Share contact
              </button>
            </div>
          ) : (
            hrPosts.map((post) => <HrPostCard key={post._id} post={post} />)
          )
        ) : communityPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg mb-1" style={{ color: "var(--text)" }}>
              No community posts yet
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-dim)" }}>
              Share something with the community
            </p>
            <button
              onClick={() => navigate("/community/create")}
              className="text-sm px-4 py-2 rounded-full"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              + Post
            </button>
          </div>
        ) : (
          communityPosts.map((post) => <CommunityPostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Profile;