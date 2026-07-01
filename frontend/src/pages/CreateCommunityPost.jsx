import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import CommunityPostForm from "../components/community/CommunityPostForm";

const CreateCommunityPost = () => {
  const navigate = useNavigate();

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

        <h1 className="font-display text-2xl font-semibold mb-1" style={{ color: "var(--text)" }}>
          Create a post
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>
          Share your experience, resume, or job tips
        </p>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <CommunityPostForm />
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPost;