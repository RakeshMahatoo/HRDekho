import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CommunityPostCard = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/likes/community/${post._id}`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  const renderMedia = () => {
    if (!post.mediaUrl) return null;
    const url = `http://localhost:5000${post.mediaUrl}`;

    if (post.type === "image") {
      return (
        <img
          src={url}
          alt="post media"
          className="w-full rounded-xl mb-3 object-cover max-h-72"
        />
      );
    }

    if (post.type === "video") {
      return (
        <video
          src={url}
          controls
          className="w-full rounded-xl mb-3 max-h-72"
        />
      );
    }

    if (post.type === "resume") {
      const handleResumeClick = (e) => {
        e.stopPropagation();
        window.open(url, "_blank");
      };

      return (
        <div
          onClick={handleResumeClick}
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-3 transition cursor-pointer"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#FF525220", color: "#FF5252" }}
          >
            PDF
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Resume
            </p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              Click to view
            </p>
          </div>
          <span className="ml-auto text-xs" style={{ color: "var(--accent)" }}>
            Download →
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={() => navigate(`/post/community/${post._id}`)}
      className="rounded-2xl p-4 mb-4 cursor-pointer transition"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-sm flex-shrink-0"
          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
        >
          {post.postedBy?.name?.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {post.postedBy?.name}
            </p>
            {post.postedBy?.openToWork && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#5EEAD420", color: "var(--accent)" }}
              >
                Open to work
              </span>
            )}
          </div>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full capitalize"
          style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}
        >
          {post.type}
        </span>
      </div>

      {post.text && (
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text)" }}>
          {post.text}
        </p>
      )}

      {renderMedia()}

      {post.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleLike}
          className="text-xs flex items-center gap-1.5"
          style={{ color: liked ? "var(--accent)" : "var(--text-dim)" }}
        >
          ♥ {likesCount}
        </button>
      </div>
    </div>
  );
};

export default CommunityPostCard;