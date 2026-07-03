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
          className="w-full rounded-2xl mb-5 object-cover max-h-[520px] border border-slate-200"
        />
      );
    }

    if (post.type === "video") {
      return (
        <video
          src={url}
          controls
          className="w-full rounded-2xl mb-5 border border-slate-200 bg-black"
        />
      );
    }

    if (post.type === "resume") {
      return (
        <div
          onClick={() => window.open(url, "_blank")}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 cursor-pointer bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 bg-red-100 text-red-600">
            PDF
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Resume</p>
            <p className="text-xs text-slate-500">Click to download</p>
          </div>
          <span className="ml-auto text-xs font-medium text-indigo-600">Download →</span>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-4 w-20 bg-slate-100 rounded mb-6 animate-pulse" />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-2.5 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded mb-2 animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-100 rounded mb-6 animate-pulse" />
            <div className="h-72 w-full bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
            🔍
          </div>
          <p className="text-lg font-semibold text-slate-900">Post not found</p>
          <p className="text-sm text-slate-500 mt-1">It may have been deleted or moved.</p>
          <button
            onClick={() => navigate("/community")}
            className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 mb-5 transition"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span> Back
        </button>

        {/* Post card */}
        <article className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-7 mb-8">
          <header className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              {post.postedBy?.name?.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {post.postedBy?.name}
                </p>
                {post.postedBy?.openToWork && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    Open to work
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full capitalize bg-slate-100 text-slate-600 border border-slate-200">
              {post.type}
            </span>
          </header>

          {post.text && (
            <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap mb-5">
              {post.text}
            </p>
          )}

          {renderMedia()}

          {post.tags?.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium hover:bg-indigo-100 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition ${
                liked
                  ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                  : "bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600"
              }`}
            >
              <span className={liked ? "scale-110" : ""}>{liked ? "♥" : "♡"}</span>
              {likesCount}
            </button>
            <div className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600">
              💬 {comments.length}
            </div>
          </div>
        </article>

        {/* Comments section */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            Comments
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {comments.length}
            </span>
          </h2>

          <form
            onSubmit={handleComment}
            className="flex flex-col sm:flex-row gap-2 mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white transition"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="text-sm font-semibold px-5 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow"
            >
              {commentLoading ? "Posting..." : "Post"}
            </button>
          </form>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium text-slate-700">No comments yet</p>
                <p className="text-xs text-slate-500 mt-1">Be the first to share a thought.</p>
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id}
                  className="rounded-2xl p-4 bg-white border border-slate-200 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex-shrink-0">
                      {c.userId?.name?.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {c.userId?.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      · {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed pl-9">
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityPostDetail;
