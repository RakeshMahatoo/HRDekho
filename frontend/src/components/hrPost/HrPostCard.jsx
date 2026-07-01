import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const HrPostCard = ({ post }) => {
  const [revealed, setRevealed] = useState(false);
  const [phone, setPhone] = useState(null);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleReveal = async (e) => {
    e.stopPropagation();
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
      className="rounded-2xl p-5 mb-4 cursor-pointer transition group"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-semibold text-sm"
            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
          >
            {post.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-medium text-sm" style={{ color: "var(--text)" }}>
              {post.companyName}
            </p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              {post.postedBy?.name} · {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
        >
          {post.role}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 mb-4 text-sm">
        <span style={{ color: "var(--text-dim)" }}>HR contact</span>
        <span style={{ color: "var(--text)" }}>{post.hrName}</span>
        <span style={{ color: "var(--text-dim)" }}>Position</span>
        <span style={{ color: "var(--text)" }}>{post.jobTitle}</span>
        <span style={{ color: "var(--text-dim)" }}>Location</span>
        <span style={{ color: "var(--text)" }}>{post.city}</span>
      </div>

      <div
        className="flex items-center justify-between rounded-xl px-3 py-2.5 mb-3"
        style={{ background: "var(--surface-2)" }}
      >
        <span className="text-sm font-mono" style={{ color: revealed ? "var(--accent)" : "var(--text-dim)" }}>
          {revealed ? phone : "•••• •• ••••"}
        </span>
        {!revealed && (
          <button
            onClick={handleReveal}
            className="text-xs font-medium px-3 py-1 rounded-lg transition"
            style={{ background: "var(--warn-dim)", color: "var(--warn)" }}
          >
            Reveal number
          </button>
        )}
      </div>

      {post.interviewQuestions && (
        <p
          className="text-sm italic mb-3 pl-3 border-l-2"
          style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
        >
          "{post.interviewQuestions}"
        </p>
      )}

      <button
        onClick={handleLike}
        className="text-xs flex items-center gap-1.5 transition"
        style={{ color: liked ? "var(--accent)" : "var(--text-dim)" }}
      >
        <span>♥</span> {likesCount}
      </button>
    </div>
  );
};

export default HrPostCard;