import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function SportsYoga() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/sports/yoga/sports_Yoga6.webp" },
  ];

  return (
    <div className="page">
      <h1>스포츠 요가/필라테스 페이지</h1>
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

export default SportsYoga;
