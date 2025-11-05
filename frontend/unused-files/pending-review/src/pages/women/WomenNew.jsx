import React from "react";
import "../Page.css";
import { useNavigate } from 'react-router-dom';
import ProductThumb from "../../components/ProductThumb";

function WomenNew() {
  const products = [
    { id: 1, name: "심플 블랙 티셔츠", desc: "데일리로 활용하기 좋은 베이직 아이템", price: "₩89,000", img: "/images/women/new/women_new1.jpg" },
    { id: 2, name: "슬림 슬랙스", desc: "세련된 핏으로 오피스룩에도 잘 어울림", price: "₩99,000", img: "/images/women/new/women_new2.webp" },
    { id: 3, name: "니트 가디건", desc: "여성스러운 무드로 다양한 계절에 활용 가능", price: "₩59,000", img: "/images/women/new/women_new3.webp" },
    { id: 4, name: "그레이 톤 팬츠", desc: "캐주얼과 포멀룩 모두 소화", price: "₩79,000", img: "/images/women/new/women_new4.jpg" },
    { id: 5, name: "화이트 베이직 티셔츠", desc: "깔끔한 스타일의 필수 아이템", price: "₩99,000", img: "/images/women/new/women_new5.webp" },
    { id: 6, name: "롱 원피스", desc: "심플하면서 우아한 라인", price: "₩109,000", img: "/images/women/new/women_new6.webp" },
  ];

  return (
    <div className="page">
      <h1>여성 신상품 페이지</h1>
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

export default WomenNew;
