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
          className="mb-3 max-h-72 w-full rounded-xl border border-slate-200 object-cover"
        />
      );
    }

    if (post.type === "video") {
      return (
        <video
          src={url}
          controls
          className="mb-3 max-h-72 w-full rounded-xl border border-slate-200"
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
          className="mb-3 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50/50"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-50 text-sm font-bold text-rose-600">
            PDF
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Resume</p>
            <p className="text-xs text-slate-400">Click to view</p>
          </div>
          <span className="ml-auto text-xs font-medium text-indigo-600">
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
      className="group mb-4 cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
          {post.postedBy?.name?.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900">
              {post.postedBy?.name}
            </p>
            {post.postedBy?.openToWork && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                Open to work
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-500">
          {post.type}
        </span>
      </div>

      {post.text && (
        <p className="mb-3 text-sm leading-relaxed text-slate-700">
          {post.text}
        </p>
      )}

      {renderMedia()}

      {post.tags?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition ${
            liked ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          ♥ {likesCount}
        </button>
      </div>
    </div>
  );
};

export default CommunityPostCard;
