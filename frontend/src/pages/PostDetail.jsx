import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [phone, setPhone] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikeStatus();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/hrposts/${id}`);
      setPost(res.data.hrPost);
      setLikesCount(res.data.hrPost.likesCount);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/hr/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await api.get(`/likes/hr/${id}`);
      setLiked(res.data.liked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReveal = async () => {
    try {
      const res = await api.post(`/reveals/${id}`);
      setPhone(res.data.hrPhone);
      setRevealed(true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not reveal number");
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.post(`/likes/hr/${id}`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.post(`/saves/hr/${id}`);
      setSaved(res.data.saved);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const res = await api.post(`/comments/hr/${id}`, { text: commentText });
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.log(err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-center py-20 text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <p className="text-center py-20 text-sm text-slate-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-4 text-slate-500 transition hover:text-indigo-600"
        >
          ← Back
        </button>

        {/* Main post card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-semibold bg-indigo-50 text-indigo-600">
                {post.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {post.companyName}
                </h1>
                <p className="text-xs text-slate-500">
                  {post.jobTitle} · {post.city}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 text-indigo-600">
              {post.role}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-y-2 mb-5 text-sm">
            <span className="text-slate-500">HR name</span>
            <span className="text-slate-900">{post.hrName}</span>
            {post.salaryRange && (
              <>
                <span className="text-slate-500">Salary range</span>
                <span className="text-slate-900">{post.salaryRange}</span>
              </>
            )}
            {post.companyWebsite && (
              <>
                <span className="text-slate-500">Website</span>
                <span className="text-indigo-600">{post.companyWebsite}</span>
              </>
            )}
          </div>

          {/* Phone reveal */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 mb-5">
            <span
              className={`text-sm font-mono ${
                revealed ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              {revealed ? phone : "•••• •• ••••"}
            </span>
            {!revealed ? (
              <button
                onClick={handleReveal}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 transition hover:bg-amber-100"
              >
                Reveal number
              </button>
            ) : (
              <span className="text-xs text-indigo-600">✓ Revealed</span>
            )}
          </div>

          {/* Job description */}
          <div className="mb-5">
            <p className="text-xs font-medium mb-1.5 text-slate-500">
              Job description
            </p>
            <p className="text-sm leading-relaxed text-slate-900">
              {post.jobDescription}
            </p>
          </div>

          {/* Interview questions */}
          {post.interviewQuestions && (
            <div className="mb-5">
              <p className="text-xs font-medium mb-1.5 text-slate-500">
                Interview questions
              </p>
              <p className="text-sm italic pl-3 border-l-2 border-slate-200 text-slate-500">
                "{post.interviewQuestions}"
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleLike}
              className={`text-sm flex items-center gap-1.5 transition ${
                liked ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              ♥ {likesCount}
            </button>
            <button
              onClick={handleSave}
              className={`text-sm flex items-center gap-1.5 transition ${
                saved ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              ★ {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-base font-semibold mb-3 text-slate-900">
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleComment} className="flex gap-2 mb-5">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your experience..."
              className="flex-1 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-center py-6 text-slate-500">
                No comments yet. Be the first to share your experience.
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-900">
                      {c.userId?.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;


//done