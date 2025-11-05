// src/hooks/useRequireAuth.js
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useRequireAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // 비로그인 → 로그인 페이지로, 돌아올 목적지 저장
      const redirectTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirectTo}`, { replace: true });
    }
  }, [user, navigate, location]);

  return !!user;
}
