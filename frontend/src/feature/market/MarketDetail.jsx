// src/feature/market/MarketDetail.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteListing, fetchOne, updateListing, deleteListingAndImages } from "./marketSlice.js";
import "./market.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";
import InquiryPanel from "./InquiryPanel.jsx";

const BACKEND_URL = "http://localhost:8080";
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function MarketDetail() {
  const { fleaKey } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.market);
  const { isAuthenticated, user } = useMarketAuth();
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    dispatch(fetchOne(fleaKey));
    setShowInquiry(false);
  }, [fleaKey, dispatch]);

  if (!current) {
    return (
      <div className="mk-container">
        <div className="mk-empty">불러오는 중…</div>
      </div>
    );
  }

  const isOwner =
    isAuthenticated && current.fleaId === (user.id || user.email);

  const onDelete = async () => {
    if (!window.confirm("삭제할까요?")) return;
    await dispatch(
      deleteListingAndImages({
        fleaKey: fleaKey,
        imageKeys: current.fleaList
      })
    ).unwrap();
    alert("삭제되었습니다.");
    navigate("/market", { replace: true });
  };

  const toggleSold = async () => {
    await dispatch(
      updateListing({
        fleaKey: current.fleaKey,
        patch: { status: current.fleaSale === "Y" ? "N" : "Y" },
      })
    ).unwrap();
    navigate(`/market/${fleaKey}`);
  };

  const images = current.fleaList ? JSON.parse(current.fleaList) : [];
  const mainImages = images.length > 0 ? images.map((key) => `${BACKEND_URL}/uploads/${key}`) : [];

  return (
    <div className="mk-container">
      <div className="mk-detail">
        <div className="mk-detail-gallery">
        {mainImages.length > 0
          ? mainImages.map((src, i) => (
              <img key={i} src={src} alt={`img-${i}`} />
            ))
          : <span>이미지 미리보기 없음</span>}
        </div>

        <div className="mk-detail-info">
          <h2>{current.fleaTitle}</h2>
          <div className="mk-detail-price">{fmt(current.fleaPrice)}</div>
          <div className="mk-detail-meta">
            {current.fleaName} · {new Date(current.fleaRdate).toLocaleString()} ·{" "}
            {current.fleaCategory}
          </div>
          <div className="mk-detail-desc">
            {current.fleaContent || "(설명 없음)"}
          </div>

          <div className="mk-detail-actions">
              {!isOwner ? (
                <button className="mk-btn outline" type="button" onClick={() => setShowInquiry((v) => !v)}>
                  {showInquiry ? "문의 닫기" : "문의하기"}
                </button>
              ) : (
                <Link to={`/market/inbox?listing=${current.fleaKey}`} className="mk-btn outline">
                  문의함
                </Link>
              )}

              {isOwner && (
                <>
                  <Link to={`/market/${current.fleaKey}/edit`} className="mk-btn">수정</Link>
                  <button className="mk-btn" onClick={toggleSold}>
                    {current.fleaSale === "Y" ? "판매중으로 변경" : "판매완료 표시"}
                  </button>
                  <button className="mk-btn danger" onClick={onDelete}>삭제</button>
                </>
              )}
            </div>

          {!isOwner && showInquiry && (
            <div style={{ marginTop: 12 }}>
              <InquiryPanel
                fleaKey={current.fleaKey}
                sellerId={current.fleaId}
                fleaName={current.fleaName}
                onClose={() => setShowInquiry(false)}
              />
            </div>
          )}

          {current.fleaSale === "Y" && (
            <div className="mk-sold-banner">판매완료</div>
          )}
        </div>
      </div>
    </div>
  );
}
