import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function ShoesWomen() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/shoes/women/shoes_women6.webp" },
  ];

  return (
    <div className="page">
      <h1>백&슈즈 여성 페이지</h1>
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

export default ShoesWomen;
