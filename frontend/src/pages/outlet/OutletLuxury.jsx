import React from "react";
import "../Page.css";
import ProductThumb from "../../components/ProductThumb";

function OutletLuxury() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "/images/outlet/luxury/outlet_luxury6.webp" },
  ];

  return (
    <div className="page">
      <h1>아울렛 럭셔리 페이지</h1>
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

export default OutletLuxury;
