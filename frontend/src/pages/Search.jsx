// src/pages/Search.jsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductThumb from "../components/ProductThumb";
import { PRODUCT_DATA } from "../data/productData";   // 실제 경로에 맞춰 수정
import { srcOf } from "../utils/srcOf";

// PRODUCT_DATA를 1차원 배열로 평탄화
function flattenProducts(data) {
  const out = [];
  Object.entries(data).forEach(([cat, sections]) => {
    Object.entries(sections).forEach(([sub, arr]) => {
      if (Array.isArray(arr)) {
        arr.forEach((p) =>
          out.push({
            ...p,
            category: cat,
            subcategory: sub,
          })
        );
      }
    });
  });
  return out;
}

export default function Search() {
  const { keyword = "" } = useParams();        // /search/:keyword
  const q = decodeURIComponent(keyword).trim();
  const all = useMemo(() => flattenProducts(PRODUCT_DATA), []);

  // ‘자켓’ 검색 → name/desc 에 포함된 상품만
  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return all.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      return name.includes(needle) || desc.includes(needle);
    });
  }, [all, q]);

  // ✅ 반드시 image 키에 절대경로로 채움
  const normalized = useMemo(
    () =>
      results.map((p) => ({
        ...p,
        image: srcOf(p.image || p.img || p.src),
      })),
    [results]
  );

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title" style={{ marginBottom: 18 }}>
          ‘{q}’ 검색 결과 <span className="count">{normalized.length}개 상품</span>
        </h2>

        <div className="product-grid">
          {normalized.map((p) => (
            <div className="product-card" key={p.id}>
              <ProductThumb product={p} />
              <h4>{p.name}</h4>
              <p className="desc">{p.desc}</p>
              <p className="price">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
