// src/components/ProductThumb.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { srcOf } from "../utils/srcOf";

export default function ProductThumb({ product, image, src }) {
  const navigate = useNavigate();
  const raw = image || src || product?.image || product?.img || product?.src || "";
  const resolved = srcOf(raw);

  const goDetail = () => {
    const normalized = {
      id: product?.id,
      name: product?.name || "상품명 없음",
      image: resolved,
      price:
        typeof product?.price === "string"
          ? Number(String(product.price).replace(/[^\d]/g, "")) || 0
          : Number(product?.price || 0),
      desc: product?.desc || "",
    };
    localStorage.setItem("lastProduct", JSON.stringify(normalized));
    navigate(`/product/${normalized.id}`, { state: { product: normalized } });
  };

  return (
    <div className="product-thumb" onClick={goDetail}>
      <img
        src={resolved}
        alt={product?.name || ""}
        loading="eager"
        // ✅ 기존 CSS가 가리는 문제 방지(absolute 강제화 되어도 덮어씀)
        style={{ position: "static", width: "100%", height: 250, objectFit: "cover", borderRadius: 12, display: "block" }}
        onError={(e) => { e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`; }}
      />
    </div>
  );
}
