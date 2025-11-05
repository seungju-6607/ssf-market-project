import React from "react";
import "../Page.css";
import { useNavigate } from 'react-router-dom';
import ProductThumb from "../../components/ProductThumb";

function WomenKnit() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/women/knit/women_Knit6.webp" },
  ];

  return (
    <div className="page">
      <h1>여성 니트 페이지</h1>
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

export default WomenKnit;
