// src/feature/market/MarketInbox.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "./marketSlice.js";
import { useMarketAuth } from "./authBridge.js";
import { messageAPI } from "./messageAPI.js";
import { Link, useLocation } from "react-router-dom";
import "./market.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function MarketInbox() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useMarketAuth();
  const { items, loading } = useSelector((s) => s.market);
  const [rows, setRows] = useState([]);
  const q = useQuery();
  const filterListingId = q.get("listing") || null;

  useEffect(() => {
    if (!items || items.length === 0) dispatch(fetchListings({}));
  }, [dispatch]); 

  const myListings = useMemo(() => {
    if (!isAuthenticated) return [];
    const me = user.id || user.email;
    return (items || []).filter((x) => x.sellerId === me);
  }, [items, isAuthenticated, user]);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      const me = user.id || user.email;
      const data = await messageAPI.listBySeller(me, { listingId: filterListingId || undefined });
      setRows(data);
    })();
  }, [isAuthenticated, user, filterListingId]);

  if (!isAuthenticated) {
    return <div className="mk-container"><div className="mk-empty">로그인이 필요합니다.</div></div>;
  }

  if (loading && !items.length) {
    return <div className="mk-container"><div className="mk-empty">불러오는 중…</div></div>;
  }

  if (!myListings.length) {
    return <div className="mk-container"><div className="mk-empty">내가 등록한 판매글이 없습니다.</div></div>;
  }

  return (
    <div className="mk-container">
      <div className="mk-head">
        <h2>문의 인박스 </h2>
      </div>

      {!rows.length ? (
        <div className="mk-empty">받은 문의가 없습니다.</div>
      ) : (
        <div className="mk-inbox">
          {rows.map((row) => {
            const item = myListings.find((x) => x.id === row.listingId);
            return (
              <Link key={row.key} to={`/market/${row.listingId}`} className="mk-inbox-row">
                <div className="mk-inbox-left">
                  <div className="mk-inbox-title">{item?.title || row.listingId}</div>
                  <div className="mk-inbox-meta">{new Date(row.last.createdAt).toLocaleString()}</div>
                </div>
                <div className="mk-inbox-right">
                  <div className="mk-inbox-last">
                    <b>{row.last.senderName}</b>
                    <div className="mk-inbox-snippet">{row.last.text}</div>
                  </div>
                  <div className="mk-inbox-count">{row.count}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
