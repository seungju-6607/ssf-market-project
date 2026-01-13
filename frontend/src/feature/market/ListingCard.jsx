import React from "react";
import { Link } from "react-router-dom";
import "./market.card.css";

const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || "";

const imgUrl = (key) => {
  if (!key) return "";
  if (/^https?:\/\//i.test(key)) return key;
  const cleaned = String(key).replace(/^\.?\/*/, "");
  const prefix = BACKEND_URL ? BACKEND_URL.replace(/\/$/, "") : "";
  return `${prefix}/uploads/${cleaned}`;
};

export default function ListingCard({ item }) {
  let images = [];
  try {
    images = item?.fleaList ? JSON.parse(item.fleaList) : [];
  } catch {
    images = [];
  }

  const mainImage = images.length > 0 ? imgUrl(images[0]) : "";

  return (
    <Link
      to={`/market/${item.fleaKey}`}
      className={`mk-card ${item.status === "SOLD" ? "sold" : ""}`}
    >
      <div className="mk-card-img">
        {mainImage ? (
          <img
            src={mainImage}
            alt={`Image for ${item.fleaTitle}`}
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder.png";
            }}
          />
        ) : (
          <span className="mk-card-list-placeholder">이미지 미리보기 없음</span>
        )}
        {item.fleaSale === "Y" && <span className="mk-badge">판매완료</span>}
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
