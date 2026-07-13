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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Profile card */}
        <div className="rounded-2xl p-6 mb-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0 bg-indigo-50 text-indigo-600">
                {user?.name?.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-slate-900">
                  {user?.name}
                </h1>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize bg-indigo-50 text-indigo-600">
                    {user?.plan}
                  </span>
                  {user?.openToWork && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                      Open to work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-xs px-3 py-1.5 rounded-full transition bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center mb-4">
            <div className="rounded-xl py-3 bg-slate-50">
              <p className="font-display font-semibold text-lg text-slate-900">
                {hrPosts.length}
              </p>
              <p className="text-xs text-slate-500">HR posts</p>
            </div>
            <div className="rounded-xl py-3 bg-slate-50">
              <p className="font-display font-semibold text-lg text-slate-900">
                {communityPosts.length}
              </p>
              <p className="text-xs text-slate-500">Posts</p>
            </div>
            <div className="rounded-xl py-3 bg-slate-50">
              <p className="font-display font-semibold text-lg text-slate-900">
                {user?.revealsLeft === 999999 ? "∞" : user?.revealsLeft}
              </p>
              <p className="text-xs text-slate-500">Reveals left</p>
            </div>
          </div>

          {/* Bio display */}
          {user?.bio && !editMode && (
            <div className="pt-4 mt-2 border-t border-slate-200">
              <p className="text-xs font-medium mb-1.5 text-slate-500">About</p>
              <p className="text-sm leading-relaxed text-slate-900">
                {user.bio}
              </p>
            </div>
          )}

          {/* Edit form */}
          {editMode && (
            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-3">
              {updateError && (
                <div className="text-sm rounded-xl px-4 py-2.5 bg-amber-50 text-amber-600 border border-amber-200">
                  {updateError}
                </div>
              )}

              <div>
                <label className="text-xs font-medium mb-1.5 block text-slate-500">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block text-slate-500">
                  Bio <span className="text-slate-500">(max 500 characters)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell the community about yourself, your skills, experience..."
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="text-xs mt-1 text-right text-slate-500">
                  {bio.length}/500
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="openToWork"
                  checked={openToWork}
                  onChange={(e) => setOpenToWork(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600"
                />
                <label htmlFor="openToWork" className="text-sm text-slate-900">
                  Open to work
                </label>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full rounded-full py-2 text-sm font-medium disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                {updating ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </div>

        {/* Tabs */}
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center py-10 text-sm text-slate-500">
            Loading...
          </p>
        ) : activeTab === "hrposts" ? (
          hrPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-lg mb-1 text-slate-900">
                No HR posts yet
              </p>
              <p className="text-sm mb-4 text-slate-500">
                Share your first HR contact
              </p>
              <button
                onClick={() => navigate("/create-post")}
                className="text-sm px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                + Share contact
              </button>
            </div>
          ) : (
            hrPosts.map((post) => <HrPostCard key={post._id} post={post} />)
          )
        ) : communityPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg mb-1 text-slate-900">
              No community posts yet
            </p>
            <p className="text-sm mb-4 text-slate-500">
              Share something with the community
            </p>
            <button
              onClick={() => navigate("/community/create")}
              className="text-sm px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              + Post
            </button>
          </div>
        ) : (
          communityPosts.map((post) => (
            <CommunityPostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
