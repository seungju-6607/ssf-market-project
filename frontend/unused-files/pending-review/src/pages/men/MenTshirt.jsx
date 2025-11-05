import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function menTshirt() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/men/tshirt/men_tshirt6.webp" },
  ];

  return (
    <div className="page">
      <h1>남성 티셔츠 페이지</h1>
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

export default menTshirt;
