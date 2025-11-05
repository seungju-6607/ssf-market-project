// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * React Router v7 전용 PrivateRoute
 * - 로그인 안 되어 있으면 /login?redirect=<원래가려던경로> 로 보냄
 * - HashRouter에서도 잘 동작 (/#/login?redirect=/checkout)
 */
const PrivateRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.auth?.isLogin);
  const location = useLocation();

  if (isLogin) {
    return children;
  }

  const target = location.pathname + (location.search || "");
  return (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(target)}`}
      replace
      state={{ from: location }}
    />
  );
};

export default PrivateRoute;
