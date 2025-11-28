import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLogout } from "../../feature/auth/authAPI";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem("users")) || []; } catch { return []; }
  });

  const authState = useSelector((state) => state.auth);
  const isAdmin = (authState?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    if (!authState?.isLogin || !isAdmin) {
      navigate("/login");
    }
  }, [authState, isAdmin, navigate]);

  const refresh = () => {
    try { setUsers(JSON.parse(localStorage.getItem("users")) || []); } catch { setUsers([]); }
  };

  const onDelete = (email) => {
    const next = users.filter(u => u.email !== email);
    localStorage.setItem("users", JSON.stringify(next));
    if (authState?.user?.email === email) {
      localStorage.setItem("isLogin", "false");
      localStorage.removeItem("loginUser");
    }
    setUsers(next);
    alert("회원이 삭제되었습니다.");
  };

  const onLogout = async () => {
    await dispatch(getLogout());
    navigate("/login");
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(term) ||
      (u.name || "").toLowerCase().includes(term)
    );
  }, [users, q]);

  const formatDate = (ms) => {
    if (!ms) return "-";
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  if (!authState?.isLogin || !isAdmin) return null;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div className="admin-title">관리자 대시보드</div>
        <div className="admin-actions">
          <Link className="btn" to="/">홈으로</Link>
          <Link className="btn" to="/admin/orders">주문 관리</Link>
          <button className="btn" onClick={onLogout}>관리자 로그아웃</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">회원 목록</div>
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="이메일 또는 이름 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn" onClick={refresh}>새로고침</button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: "32px"}}>#</th>
                <th>이메일</th>
                <th>이름</th>
                <th style={{width: "180px"}}>가입일시</th>
                <th style={{width: "120px"}}>권한</th>
                <th style={{width: "120px"}}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">회원이 없습니다.</td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.email}>
                    <td>{i + 1}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{formatDate(u.joinedAt)}</td>
                    <td>{u.role || "user"}</td>
                    <td>
                      <button className="btn-danger" onClick={() => onDelete(u.email)}>탈퇴</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
