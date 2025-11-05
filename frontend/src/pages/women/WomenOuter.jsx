// src/pages/women/WomenOuter.jsx
import React from "react";
import "../Page.css";
import ProductThumb from "../../components/ProductThumb";

export default function WomenOuter() {
  const products = [
    { id: 1, name: "베이지 캐주얼 자켓", desc: "데일리로 활용하기 좋은 기본 아우터", price: "₩129,000", img: "/images/women/outer/women_outer1.webp" },
    { id: 2, name: "패턴 자켓", desc: "유니크한 감각으로 스트릿 패션에 적합", price: "₩159,000", img: "/images/women/outer/women_outer2.webp" },
    { id: 3, name: "블랙 라이더 자켓", desc: "시크한 무드의 포인트 아이템", price: "₩189,000", img: "/images/women/outer/women_outer3.webp" },
    { id: 4, name: "경량 패딩 자켓", desc: "가볍지만 따뜻한 간절기 필수템", price: "₩99,000", img: "/images/women/outer/women_outer4.webp" },
    { id: 5, name: "블랙 포켓 자켓", desc: "편안한 핏으로 스타일리시하게 연출 가능", price: "₩149,000", img: "/images/women/outer/women_outer5.webp" },
    { id: 6, name: "카키 오버핏 자켓", desc: "실용성과 멋을 동시에 갖춘 아이템", price: "₩139,000", img: "/images/women/outer/women_outer6.webp" },
  ];

  return (
    <div className="page">
      <h1>여성 아우터 페이지</h1>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <ProductThumb product={p} />
            <h4>{p.name}</h4>
            <p className="desc">{p.desc}</p>
            <p className="price">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
