import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";      
import { NAV } from "../../data/navData";

export default function Menu() {
  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1>전체 카테고리</h1>
        <p>브랜드와 카테고리를 한눈에 살펴보세요.</p>
      </header>

      <div className="menu-grid">
        {Object.entries(NAV).map(([sectionKey, categories]) => (
          <div className="menu-group" key={sectionKey}>
            <h2 className="menu-group-title">
              {sectionKey.toUpperCase()}{" "}
              <span style={{ fontWeight: "normal", color: "#555" }}>
                {sectionKey === "women"
                  ? "여성"
                  : sectionKey === "men"
                  ? "남성"
                  : sectionKey === "kids"
                  ? "키즈 & 스포츠"
                  : sectionKey === "luxury"
                  ? "럭셔리 & 디자이너"
                  : sectionKey === "beauty"
                  ? "뷰티 & 라이프"
                  : sectionKey === "life"
                  ? "라이프"
                  : sectionKey === "sports"
                  ? "스포츠"
                  : sectionKey === "golf"
                  ? "골프"
                  : sectionKey === "outlet"
                  ? "아울렛"
                  : ""}
              </span>
            </h2>

            <ul className="menu-list">
              {categories.map((item) => (
                <li key={item.to}>
                  <Link className="menu-link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
