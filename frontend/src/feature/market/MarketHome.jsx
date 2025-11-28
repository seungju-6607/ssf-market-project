import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../feature/market/marketSlice.js";
import ListingCard from "./ListingCard.jsx";
import "./market.css";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function MarketHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q0 = searchParams.get("q") || "";
  const [q, setQ] = useState(q0);
  const [category, setCategory] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.market);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin") === "true";
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    setQ(q0);
  }, [q0]);

  useEffect(() => {
    dispatch(fetchListings({ q: q0, category, onlyAvailable }));
  }, [q0, category, onlyAvailable, dispatch]);

  const onSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (q.trim()) params.q = q.trim();
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="mk-container">
      <div className="mk-head">
        <h2>플리마켓</h2>
        <div className="mk-actions">
          <Link to="/market/new" className="mk-btn primary">+ 판매글 올리기</Link>
        </div>
      </div>

      <form className="mk-filters" onSubmit={onSearch}>
        <input placeholder="검색 (제목/설명/판매자)" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">전체</option>
          <option value="fashion">패션</option>
          <option value="electronics">전자기기</option>
          <option value="life">생활/가전</option>
          <option value="hobby">취미/게임</option>
          <option value="etc">기타</option>
        </select>
        <label className="mk-checkbox">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          판매중만 보기
        </label>
        <button className="mk-btn" type="submit">검색</button>
      </form>

      {loading ? (
        <div className="mk-empty">불러오는 중…</div>
      ) : items.length ? (
        <div className="mk-grid">
          {items.map((item) => (
            <ListingCard key={item.fleaKey} item={item} />
          ))}
        </div>
      ) : (
        <div className="mk-empty">게시글이 없습니다.</div>
      )}
    </div>
  );
}
