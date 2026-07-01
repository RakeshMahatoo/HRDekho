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
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <Navbar />
        <p className="text-center py-20 text-sm" style={{ color: "var(--text-dim)" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <Navbar />
        <p className="text-center py-20 text-sm" style={{ color: "var(--text-dim)" }}>
          Post not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-4"
          style={{ color: "var(--text-dim)" }}
        >
          ← Back
        </button>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-semibold"
                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
              >
                {post.companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold" style={{ color: "var(--text)" }}>
                  {post.companyName}
                </h1>
                <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                  {post.jobTitle} · {post.city}
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

          <div className="grid grid-cols-2 gap-y-2 mb-5 text-sm">
            <span style={{ color: "var(--text-dim)" }}>HR name</span>
            <span style={{ color: "var(--text)" }}>{post.hrName}</span>
            {post.salaryRange && (
              <>
                <span style={{ color: "var(--text-dim)" }}>Salary range</span>
                <span style={{ color: "var(--text)" }}>{post.salaryRange}</span>
              </>
            )}
            {post.companyWebsite && (
              <>
                <span style={{ color: "var(--text-dim)" }}>Website</span>
                <span style={{ color: "var(--accent)" }}>{post.companyWebsite}</span>
              </>
            )}
          </div>

          <div
            className="flex items-center justify-between rounded-xl px-4 py-3 mb-5"
            style={{ background: "var(--surface-2)" }}
          >
            <span
              className="text-sm font-mono"
              style={{ color: revealed ? "var(--accent)" : "var(--text-dim)" }}
            >
              {revealed ? phone : "•••• •• ••••"}
            </span>
            {!revealed ? (
              <button
                onClick={handleReveal}
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ background: "var(--warn-dim)", color: "var(--warn)" }}
              >
                Reveal number
              </button>
            ) : (
              <span className="text-xs" style={{ color: "var(--accent)" }}>
                ✓ Revealed
              </span>
            )}
          </div>

          <div className="mb-5">
            <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
              Job description
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
              {post.jobDescription}
            </p>
          </div>

          {post.interviewQuestions && (
            <div className="mb-5">
              <p className="text-xs font-medium mb-1.5" style={{ color: "var(--text-dim)" }}>
                Interview questions
              </p>
              <p
                className="text-sm italic pl-3 border-l-2"
                style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
              >
                "{post.interviewQuestions}"
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={handleLike}
              className="text-sm flex items-center gap-1.5"
              style={{ color: liked ? "var(--accent)" : "var(--text-dim)" }}
            >
              ♥ {likesCount}
            </button>
            <button
              onClick={handleSave}
              className="text-sm flex items-center gap-1.5"
              style={{ color: saved ? "var(--accent)" : "var(--text-dim)" }}
            >
              ★ {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-display text-base font-semibold mb-3" style={{ color: "var(--text)" }}>
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleComment} className="flex gap-2 mb-5">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your experience..."
              className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="text-sm font-medium px-4 py-2 rounded-full disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: "var(--text-dim)" }}>
                No comments yet. Be the first to share your experience.
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="rounded-xl p-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                      {c.userId?.name}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                    {c.text}
                  </p>
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