// src/feature/market/MarketInbox.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings } from "./marketSlice.js";
import { useMarketAuth } from "./authBridge.js";
import { messageAPI } from "./messageAPI.js";
import { Link, useLocation } from "react-router-dom";
import "./market.css";
import InquiryPanelSeller from "./InquiryPanelSeller.jsx";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function MarketInbox() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useMarketAuth();
  const { items, loading } = useSelector((s) => s.market);
  const [rows, setRows] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const q = useQuery();
  const filterListingId = q.get("listing") || null;

  const me = useMemo(() => {
    if (!isAuthenticated) return null;
    return user?.id || user?.email;
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || !me) return;

    (async () => {
      const data = await messageAPI.listBySeller(me, { fleaKey : filterListingId || undefined });
      setRows(data);
    })();
  }, [isAuthenticated, me, filterListingId]);

  useEffect(() => {
    if (!items || items.length === 0) dispatch(fetchListings({}));
  }, [dispatch, items]);

  const myListings = useMemo(() => {
    if (!isAuthenticated || !me) return [];
    return (items || []).filter((x) => x.fleaId === me)
  }, [items, isAuthenticated, me]);

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
            {rows.map((row, idx) => {
              const item = myListings.find((x) => x.fleaKey === row.fleaKey);
              const isSelected = selectedChat === idx;  // 선택된 대화인지 체크

              return (
                <div key={idx}>
                  {/* 클릭된 row에 대한 표시 */}
                  <div
                    className={`mk-inbox-row ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedChat(isSelected ? null : idx)}
                  >
                    <div className="mk-inbox-left">
                      <div className="mk-inbox-title">{item?.fleaTitle || row.fleaKey}</div>
                      <div className="mk-inbox-meta">
                        {new Date(row.last.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mk-inbox-right">
                      <div className="mk-inbox-last">
                        <b>{row.senderName}</b>
                        <div className="mk-inbox-snippet">{row.last.inquiryMsg}</div>
                      </div>
                      <div className="mk-inbox-count">{row.count}</div>
                    </div>
                  </div>

                  {/* 선택된 대화창을 해당 row 밑에 표시 */}
                  {isSelected && (
                    <div style={{ marginTop: 12 }}>
                      <InquiryPanelSeller
                        fleaKey={row.fleaKey}
                        buyerId={row.buyerId}
                        onClose={() => setSelectedChat(null)} // 대화창 닫기
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
  );
}
