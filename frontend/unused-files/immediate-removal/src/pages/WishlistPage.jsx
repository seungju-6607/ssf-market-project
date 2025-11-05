import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WishlistPage.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="wishlist-page container">
      <h1>나의 위시리스트 ❤️</h1>
      {wishlist.length === 0 ? (
        <p className="empty">찜한 상품이 없습니다.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} />
              </Link>
              <h4>{item.name}</h4>
              <p className="price">{item.price}원</p>
              <button onClick={() => removeItem(item.id)} className="remove-btn">
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
