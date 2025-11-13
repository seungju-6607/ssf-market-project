// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { ready, isAuthenticated } = useAuth();
  const location = useLocation();


  if (!ready) return null; 

  if (isAuthenticated) return children;

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
