import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

const CommunityPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
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
      const res = await api.get(`/community/${id}`);
      setPost(res.data.post);
      setLikesCount(res.data.post.likesCount);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/community/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await api.get(`/likes/community/${id}`);
      setLiked(res.data.liked);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.post(`/likes/community/${id}`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await api.post(`/comments/community/${id}`, { text: commentText });
      setComments([res.data.comment, ...comments]);
      setCommentText("");
    } catch (err) {
      console.log(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const renderMedia = () => {
    if (!post?.mediaUrl) return null;
    const url = `http://localhost:5000${post.mediaUrl}`;

    if (post.type === "image") {
      return (
        <img
          src={url}
          alt="post media"
          className="w-full rounded-xl mb-4 object-cover max-h-96"
        />
      );
    }

    if (post.type === "video") {
      return (
        <video
          src={url}
          controls
          className="w-full rounded-xl mb-4"
        />
      );
    }

    if (post.type === "resume") {
      return (
        <div
          onClick={() => window.open(url, "_blank")}
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4 cursor-pointer"
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
              Click to download
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
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold flex-shrink-0"
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
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text)" }}>
              {post.text}
            </p>
          )}

          {renderMedia()}

          {post.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
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

          <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <button
              onClick={handleLike}
              className="text-sm flex items-center gap-1.5"
              style={{ color: liked ? "var(--accent)" : "var(--text-dim)" }}
            >
              ♥ {likesCount}
            </button>
          </div>
        </div>

        <h2
          className="font-display text-base font-semibold mb-3"
          style={{ color: "var(--text)" }}
        >
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleComment} className="flex gap-2 mb-5">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
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
              No comments yet. Be the first.
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
  );
};

export default CommunityPostDetail;