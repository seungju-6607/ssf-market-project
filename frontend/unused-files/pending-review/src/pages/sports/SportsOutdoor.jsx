import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function SportsOutdoor() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/sprots/outdoor/sports_outdoor6.webp" },
  ];

  return (
    <div className="page">
      <h1>스포츠 아웃도어 페이지</h1>
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

export default SportsOutdoor;
