import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Saved from "./pages/Saved";
import Community from "./pages/Community";
import CreateCommunityPost from "./pages/CreateCommunityPost";
import Profile from "./pages/Profile";
import CommunityPostDetail from "./pages/CommunityPostDetail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GoogleAuthSuccess from "./pages/GoogleAuthSuccess";
import Landing from "./pages/Landing";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/google-auth" element={<GoogleAuthSuccess />} />

          {/* Public browsing routes */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/post/hr/:id" element={<PostDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:companyName" element={<CompanyDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/post/community/:id" element={<CommunityPostDetail />} />

          {/* Protected routes — login required */}
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community/create"
            element={
              <ProtectedRoute>
                <CreateCommunityPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

         <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;