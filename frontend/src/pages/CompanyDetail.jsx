import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import HrPostCard from "../components/hrpost/HrPostCard";

const CompanyDetail = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [companyName]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/hrposts/company/${companyName}`);
      setPosts(res.data.hrPosts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const decodedName = decodeURIComponent(companyName || "");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-4 text-slate-500 hover:text-slate-700 transition"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-semibold text-lg bg-indigo-50 text-indigo-600">
            {decodedName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-slate-900">
              {decodedName}
            </h1>
            <p className="text-sm text-slate-500">
              {posts.length} contact{posts.length !== 1 ? "s" : ""} shared
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-sm text-slate-500">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center py-10 text-sm text-slate-500">
            No posts found for this company
          </p>
        ) : (
          posts.map((post) => <HrPostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
