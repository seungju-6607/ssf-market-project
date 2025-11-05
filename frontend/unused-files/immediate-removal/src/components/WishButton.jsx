// src/components/WishButton.jsx
import React, { useEffect, useState } from "react";

export default function WishButton({ productId, isWished, onToggle, product }) {
  const [on, setOn] = useState(!!isWished);
  const [pending, setPending] = useState(false);

  useEffect(() => setOn(!!isWished), [isWished]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    setOn((prev) => !prev);

    try {
      await onToggle(productId, !on, product);
    } catch (err) {
      setOn((prev) => !prev);
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      className={`wishlist-btn ${on ? "on" : ""}`}
      aria-pressed={on}
      aria-label={on ? "위시 제거" : "위시에 추가"}
      onClick={handleToggle}
      disabled={pending}
    >
      <svg className="heart" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 17.25s-6.25-3.75-8.125-7.5C.625 6.5 2.75 4 5.25 4 7.1 4 8.3 5 10 6.9 11.7 5 12.9 4 14.75 4c2.5 0 4.625 2.5 3.375 5.75C16.25 13.5 10 17.25 10 17.25z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
      </svg>
    </button>
  );
}
