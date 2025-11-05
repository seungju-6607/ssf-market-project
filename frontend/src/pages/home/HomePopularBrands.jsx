import React from "react";
import { Link } from "react-router-dom";
import Brand8Seconds from "../../components/brands/Brand8Seconds";

export default function HomePopularBrands() {
  return (
    <section className="container" style={{ marginTop: 32 }}>
      <h3 className="sec-title">인기 브랜드</h3>

      <div className="brand-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "18px"
      }}>
        {/* 1) 8SECONDS: 커스텀 타일 */}
        <Brand8Seconds />

        {/* 2) 나머지는 기존 스타일 유지 (예시) */}
        <Link to="/brand/beanpole" className="brand-cell">BEANPOLE</Link>
        <Link to="/brand/beaker" className="brand-cell">BEAKER</Link>
        <Link to="/brand/kuho" className="brand-cell">KUHO</Link>
        {/* ... */}
      </div>
    </section>
  );
}
