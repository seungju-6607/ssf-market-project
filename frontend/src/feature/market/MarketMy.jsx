// src/feature/market/MarketMy.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "../../feature/market/marketSlice.js";
import ListingCard from "./ListingCard.jsx";
import "./market.css";
import { useMarketAuth } from "./authBridge.js";

export default function MarketMy() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useMarketAuth();
  const { items, loading } = useSelector((s) => s.market);

  useEffect(() => {
    dispatch(fetchListings({ useListOnly: true }));
  }, [dispatch]);

  const mine = useMemo(() => {
    if (!user) return [];
    const me = user.id || user.email;
    return items.filter((x) => x.fleaId === me);
  }, [items, user]);

  if (!isAuthenticated) {
    return (
      <div className="mk-container">
        <div className="mk-empty">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="mk-container">
      <div className="mk-head">
        <h2>내 판매글</h2>
      </div>
      {loading ? (
        <div className="mk-empty">불러오는 중…</div>
      ) : mine.length ? (
        <div className="mk-grid">
          {mine.map((it) => (
            <ListingCard key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <div className="mk-empty">등록한 판매글이 없습니다.</div>
      )}
    </div>
  );
}
