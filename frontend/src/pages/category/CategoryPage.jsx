import React from "react";
import products from "../../data/products";

function CategoryPage() {
  return (
    <div>
      <h1>카테고리 페이지</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <img src={p.image} alt={p.name} />
            <p>{p.name}</p>
            <p>{p.price.toLocaleString()}원</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryPage;
