import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const POST_TYPES = [
  { value: "text", label: "✏️ Text" },
  { value: "image", label: "🖼️ Image" },
  { value: "video", label: "🎥 Video" },
  { value: "resume", label: "📄 Resume" },
];

const CommunityPostForm = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("text");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      if (text) formData.append("text", text);
      if (file) formData.append("media", file);
      if (tags) {
        const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
        formData.append("tags", JSON.stringify(tagArray));
      }

      await api.post("/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/community");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="text-sm rounded-xl px-4 py-2.5"
          style={{ background: "#F5973520", color: "var(--warn)", border: "1px solid var(--warn)" }}
        >
          {error}
        </div>
      )}

      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
          Post type
        </label>
        <div className="flex gap-2 flex-wrap">
          {POST_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className="text-xs px-3 py-1.5 rounded-full transition"
              style={{
                background: type === t.value ? "var(--accent)" : "var(--surface-2)",
                color: type === t.value ? "var(--bg)" : "var(--text-dim)",
                border: `1px solid ${type === t.value ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
          {type === "text" ? "What's on your mind?" : "Caption (optional)"}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Share something with the community..."
          className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
      </div>

      {type !== "text" && (
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
            {type === "image" && "Upload image"}
            {type === "video" && "Upload video"}
            {type === "resume" && "Upload resume (PDF)"}
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept={
              type === "image" ? "image/*" :
              type === "video" ? "video/*" :
              "application/pdf"
            }
            className="w-full text-sm rounded-lg px-3 py-2"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-dim)" }}
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-dim)" }}>
          Tags (optional, comma separated)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. TCS, interview, placed"
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-2.5 text-sm font-medium transition disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        {loading ? "Posting..." : "Post to community"}
      </button>
    </form>
  );
};

export default CommunityPostForm;