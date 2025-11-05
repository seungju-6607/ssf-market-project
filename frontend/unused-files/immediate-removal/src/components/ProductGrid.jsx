import React from "react";
import "./ProductGrid.css";

function ProductGrid({ title, products }) {
  return (
    <div className="product-page">
      <h2>{title}</h2>
      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
