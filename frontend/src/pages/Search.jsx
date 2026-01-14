// src/pages/Search.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosJWT from "../api/axiosJWT.js";
import ProductThumb from "../components/ProductThumb";
import { srcOf } from "../utils/srcOf";

const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

export default function Search() {
  const { keyword = "" } = useParams();
  const q = decodeURIComponent(keyword).trim();

  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!q) {
        if (mounted) setItems([]);
        return;
      }
      try {
        const res = await axiosJWT.get(
          `/api/items/search?q=${encodeURIComponent(q)}`
        );
        if (mounted) setItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("search error:", e);
        if (mounted) setItems([]);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [q]);

  const normalized = useMemo(() => {
    return items.map((it) => {
      let firstImg = "";
      try {
        const arr = JSON.parse(it.itemList || "[]");
        firstImg = arr?.[0] || "";
      } catch {}

      return {
        id: it.itemKey,
        name: it.itemName,
        desc: it.itemContent,
        price: toNumber(it.itemPrice),
        img: srcOf(firstImg),
      };
    });
  }, [items]);

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title" style={{ marginBottom: 18 }}>
          ‘{q}’ 검색 결과{" "}
          <span className="count">{normalized.length}개 상품</span>
        </h2>

        <div className="product-grid">
          {normalized.map((p) => (
            <div className="product-card" key={p.id}>
              <ProductThumb product={p} />
              <h4>{p.name}</h4>
              <p className="desc">{p.desc}</p>
              <p className="price">₩{p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
