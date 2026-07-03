import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = {
      _id: searchParams.get("_id"),
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      plan: searchParams.get("plan"),
      openToWork: searchParams.get("openToWork") === "true",
      revealsLeft: Number(searchParams.get("revealsLeft")),
    };

    if (token) {
      localStorage.setItem("token", token);
      setUser(user);
      navigate("/feed");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAFC" }}>
      <p style={{ color: "#6B7280", fontSize: 14 }}>Signing you in with Google...</p>
    </div>
  );
};

export default GoogleAuthSuccess;