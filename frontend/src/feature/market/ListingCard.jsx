import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./market.card.css";
import { getImageFromIndexedDB, parseFleaList } from "../../utils/imageUtils.js";

const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const BACKEND_URL = "http://localhost:8080";

export default function ListingCard({ item }) {
  const images = item.fleaList ? JSON.parse(item.fleaList) : [];
  const mainImage = images.length > 0 ? `${BACKEND_URL}/uploads/${images[0]}` : null;

  return (
    <Link to={`/market/${item.fleaKey}`} className={`mk-card ${item.status === "SOLD" ? "sold" : ""}`}>
      <div className="mk-card-img">
        {mainImage ? (
          <img src={mainImage} alt={`Image for ${item.fleaTitle}`} />
        ) : (
          <span className="mk-card-list-placeholder">이미지 미리보기 없음</span>
        )}
        {item.fleaSale=== "Y" && <span className="mk-badge">판매완료</span>}
      </div>
      <div className="mk-card-body">
        <div className="mk-title">{item.fleaTitle}</div>
        <div className="mk-price">{fmt(item.fleaPrice)}</div>
        <div className="mk-meta">
          {item.fleaName} · {new Date(item.fleaRdate).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
