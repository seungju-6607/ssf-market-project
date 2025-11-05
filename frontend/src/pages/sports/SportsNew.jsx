import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function SportsNew() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/sports/new/sports_new1.jpg" },
    { id: 2, name: "", desc: "", price: "", img: "/images/sports/new/sports_new2.jpg" },
    { id: 3, name: "", desc: "", price: "", img: "/images/sports/new/sports_new3.jpg" },
    { id: 4, name: "", desc: "", price: "", img: "/images/sports/new/sports_new4.jpg" },
    { id: 5, name: "", desc: "", price: "", img: "/images/sports/new/sports_new5.jpg" },
    { id: 6, name: "", desc: "", price: "", img: "/images/sports/new/sports_new6.jpg" },
  ];

  return (
    <div className="page">
      <h1>스포츠 신상품 페이지</h1>
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

export default SportsNew;
