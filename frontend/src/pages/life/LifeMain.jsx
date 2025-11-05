import React from "react";
import "../Page.css";
import ProductThumb from "../../components/ProductThumb";

function LifeMain() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/life/car/life_car1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/life/car/life_car2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/life/car/life_car3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/life/car/life_car4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/life/car/life_car5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/life/car/life_car6.webp" },
  ];

  return (
    <div className="page">
      <h1>라이프 메인 페이지</h1>
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

export default LifeMain;