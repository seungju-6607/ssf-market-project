import React from "react";
import { Link } from "react-router-dom";
import "./market.card.css";

const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function ListingCard({ item }) {
  const thumb = item.images?.[0] || `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
  return (
    <Link to={`/market/${item.id}`} className={`mk-card ${item.status === "SOLD" ? "sold" : ""}`}>
      <div className="mk-card-img">
        <img src={thumb} alt={item.title} />
        {item.status === "SOLD" && <span className="mk-badge">판매완료</span>}
      </div>
      <div className="mk-card-body">
        <div className="mk-title">{item.title}</div>
        <div className="mk-price">{fmt(item.price)}</div>
        <div className="mk-meta">
          {item.sellerName} · {new Date(item.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
