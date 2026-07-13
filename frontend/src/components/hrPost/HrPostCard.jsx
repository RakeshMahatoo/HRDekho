import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const HrPostCard = ({ post }) => {
  const { user } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const [phone, setPhone] = useState(null);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleReveal = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.post(`/reveals/${post._id}`);
      setPhone(res.data.hrPhone);
      setRevealed(true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not reveal number");
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.post(`/likes/hr/${post._id}`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/post/hr/${post._id}`)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200 group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm bg-indigo-50 text-indigo-600">
            {post.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">
              {post.companyName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {post.postedBy?.name} ·{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-600">
          {post.role}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
        <span className="text-slate-400">HR contact</span>
        <span className="text-slate-900 font-medium">{post.hrName}</span>
        <span className="text-slate-400">Position</span>
        <span className="text-slate-900 font-medium">{post.jobTitle}</span>
        <span className="text-slate-400">Location</span>
        <span className="text-slate-900 font-medium">{post.city}</span>
      </div>

      {/* Phone reveal */}
      <div className="flex items-center justify-between rounded-xl px-3 py-2.5 mb-3 bg-slate-50">
        <span className="flex items-center gap-2 text-sm font-mono min-w-0">
          <svg
            className="shrink-0 w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M3 5a2 2 0 012-2h3.382a1 1 0 01.894.553l1.272 2.544a1 1 0 01-.27 1.154l-1.27 1.27a16 16 0 006.586 6.586l1.27-1.27a1 1 0 011.154-.27l2.544 1.272a1 1 0 01.553.894V19a2 2 0 01-2 2A16 16 0 013 5z"
            />
          </svg>
          <span
            className={`truncate ${
              revealed ? "text-indigo-600 font-semibold" : "text-slate-400"
            }`}
          >
            {revealed ? phone : "•••• •• ••••"}
          </span>
        </span>
        {!revealed && (
          <button
            onClick={handleReveal}
            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            {user ? "Reveal number" : "Login to reveal"}
          </button>
        )}
      </div>

      {/* Interview questions */}
      {post.interviewQuestions && (
        <p className="text-sm italic mb-3 pl-3 border-l-2 border-indigo-200 text-slate-500 leading-relaxed">
          "{post.interviewQuestions}"
        </p>
      )}

      {/* Like */}
      <button
        onClick={handleLike}
        className={`text-xs flex items-center gap-1.5 transition ${
          liked ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likesCount}
      </button>
    </div>
  );
};

export default HrPostCard;
