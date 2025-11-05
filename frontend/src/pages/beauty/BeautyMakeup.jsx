import React from "react";
import "../Page.css";
import ProductThumb from "../../components/ProductThumb";

function BeautyMakeup() {Beauty/BeautyMakeup
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/Beauty/Makeup/beauty_makeup6.webp" },
  ];

  return (
    <div className="page">
      <h1>뷰티 메이크업 페이지</h1>
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

export default BeautyMakeup;