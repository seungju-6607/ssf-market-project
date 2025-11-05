import { useEffect } from "react";
import { logoutApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    logoutApi();
    navigate("/");
  }, [navigate]);
  return null;
}
