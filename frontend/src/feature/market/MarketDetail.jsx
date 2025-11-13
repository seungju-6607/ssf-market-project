// src/feature/market/MarketDetail.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteListing, fetchOne, updateListing } from "./marketSlice.js";
import "./market.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";
import InquiryPanel from "./InquiryPanel.jsx";

const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function MarketDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.market);
  const { isAuthenticated, user } = useMarketAuth();
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    dispatch(fetchOne(id));
    setShowInquiry(false);
  }, [id, dispatch]);

  if (!current) {
    return (
      <div className="mk-container">
        <div className="mk-empty">불러오는 중…</div>
      </div>
    );
  }

  const isOwner =
    isAuthenticated && current.sellerId === (user.id || user.email);

  const onDelete = async () => {
    if (!window.confirm("삭제할까요?")) return;
    await dispatch(
      deleteListing({ id, userId: user?.id || user?.email })
    ).unwrap();
    navigate("/market", { replace: true });
  };

  const toggleSold = async () => {
    await dispatch(
      updateListing({
        id,
        patch: { status: current.status === "SOLD" ? "FOR_SALE" : "SOLD" },
      })
    ).unwrap();
  };

  return (
    <div className="mk-container">
      <div className="mk-detail">
        <div className="mk-detail-gallery">
          {(current.images?.length ? current.images : [""]).map((src, i) => (
            <img
              key={i}
              src={src || `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`}
              alt={`img-${i}`}
            />
          ))}
        </div>

        <div className="mk-detail-info">
          <h2>{current.title}</h2>
          <div className="mk-detail-price">{fmt(current.price)}</div>
          <div className="mk-detail-meta">
            {current.sellerName} · {new Date(current.createdAt).toLocaleString()} ·{" "}
            {current.category}
          </div>
          <div className="mk-detail-desc">
            {current.description || "(설명 없음)"}
          </div>

          <div className="mk-detail-actions">
            {!isOwner ? (
              <button
                className="mk-btn outline"
                type="button"
                onClick={() => setShowInquiry((v) => !v)}
              >
                {showInquiry ? "문의 닫기" : "문의하기"}
              </button>
            ) : (
              <Link
                to={`/market/inbox?listing=${current.id}`}
                className="mk-btn outline"
              >
                문의함
              </Link>
            )}

            {isOwner && (
              <>
                <Link to={`/market/${current.id}/edit`} className="mk-btn">
                  수정
                </Link>
                <button className="mk-btn" onClick={toggleSold}>
                  {current.status === "SOLD" ? "판매중으로 변경" : "판매완료 표시"}
                </button>
                <button className="mk-btn danger" onClick={onDelete}>
                  삭제
                </button>
              </>
            )}
          </div>

          {!isOwner && showInquiry && (
            <div style={{ marginTop: 12 }}>
              <InquiryPanel
                listingId={current.id}
                sellerId={current.sellerId}
                sellerName={current.sellerName}
                onClose={() => setShowInquiry(false)}
              />
            </div>
          )}

          {current.status === "SOLD" && (
            <div className="mk-sold-banner">판매완료</div>
          )}
        </div>
      </div>
    </div>
  );
}
