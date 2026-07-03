import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import CommunityPostCard from "../components/community/CommunityPostCard";

const FILTERS = [
  { value: "", label: "All" },
  { value: "text", label: "✏️ Text" },
  { value: "image", label: "🖼️ Image" },
  { value: "video", label: "🎥 Video" },
  { value: "resume", label: "📄 Resume" },
];

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [activeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/community", {
        params: activeFilter ? { type: activeFilter } : {},
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen antialiased bg-white text-slate-900">
      <Navbar />

      {/* Ambient background accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-14">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start sm:items-center gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-[0.14em] px-2.5 py-1 rounded-full mb-3 bg-slate-50 text-slate-500 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Live feed
            </div>
            <h1 className="font-display text-[26px] leading-tight sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Community
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base max-w-md text-slate-500">
              Share your experience, resume, or tips with builders like you.
            </p>
          </div>

          <Link
            to="/community/create"
            className="group shrink-0 inline-flex items-center gap-1.5 sm:gap-2 text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="text-base leading-none transition-transform duration-200 group-hover:rotate-90">
              +
            </span>
            <span className="hidden sm:inline">New post</span>
            <span className="sm:hidden">Post</span>
          </Link>
        </header>
 
          {/* Desktop 2-column layout, single column on mobile */}
           <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 xl:gap-10">
           {/* Feed column */}
           <div className="min-w-0">
            {/* Sticky filter bar */}
            <div className="sticky top-2 z-20 mb-6 sm:mb-8 rounded-2xl backdrop-blur-md bg-white/75 border border-slate-200 shadow-sm">
              <div
                className="flex gap-2 overflow-x-auto p-2 sm:p-2.5 sm:flex-wrap sm:overflow-visible"
                style={{ scrollbarWidth: "none" }}
              >
                {FILTERS.map((f) => {
                  const isActive = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      className={
                        "shrink-0 text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap border transition-all duration-200 hover:-translate-y-0.5 " +
                        (isActive
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900")
                      }
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col gap-4 sm:gap-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200 animate-pulse"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                        <div className="h-2.5 w-1/5 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-11/12 rounded bg-slate-200" />
                      <div className="h-3 w-9/12 rounded bg-slate-200" />
                      <div className="h-3 w-7/12 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="relative overflow-hidden text-center py-16 sm:py-24 px-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50">
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_0%,theme(colors.indigo.100),transparent_60%)]" />
                <div className="relative">
                  <div className="mx-auto mb-5 grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-2xl text-3xl sm:text-4xl bg-white border border-slate-200 shadow-sm">
                    💭
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-semibold mb-2 text-slate-900">
                    No posts yet
                  </p>
                  <p className="text-sm sm:text-base mb-6 max-w-sm mx-auto text-slate-500">
                    Be the first to share something with the community.
                  </p>
                  <Link
                    to="/community/create"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Create first post
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:gap-5">
                {posts.map((post) => (
                  <CommunityPostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-4 flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  About the community
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  A space to share resumes, tips, and experiences with fellow
                  builders. Be kind, be helpful.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Post types
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {FILTERS.filter((f) => f.value).map((f) => (
                    <li key={f.value} className="flex items-center gap-2">
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                  Share your story
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Got a win, a resume, or advice? Post it — someone needs to
                  hear it.
                </p>
                <Link
                  to="/community/create"
                  className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-all duration-200"
                >
                  + New post
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Community;
