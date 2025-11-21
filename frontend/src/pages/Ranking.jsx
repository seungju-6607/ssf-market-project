import React, { useState } from "react";
import "./Ranking.css";
import { useNavigate } from "react-router-dom";
import { rankingData, RANKING_TABS } from "../data/rankingData.generated";

export default function Ranking() {
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState(RANKING_TABS[0].key);

  const rawList = rankingData[tabKey] || [];

  const list = rawList
    .slice()
    .sort((a, b) => b.price - a.price)
    .slice(0, 60);

  const goDetail = (item) => {
    navigate(`/product/${item.id}`, {
      state: { product: item },
    });
    try {
      localStorage.setItem("lastProduct", JSON.stringify(item));
    } catch (e) {}
  };

  return (
    <div className="ranking-page">
      <div className="ranking-tabs">
        {RANKING_TABS.map((t) => (
          <button
            key={t.key}
            className={`rank-tab ${tabKey === t.key ? "active" : ""}`}
            onClick={() => setTabKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ranking-grid">
        {list.map((item, idx) => {
          const rankNumber = idx + 1;

          return (
            <div key={`${tabKey}-${idx}`} className="rank-card">
              <div className="rank-number">
                {rankNumber}
                <span
                  className={`rank-change ${
                    item.rankChange > 0
                      ? "up"
                      : item.rankChange < 0
                      ? "down"
                      : ""
                  }`}
                >
                  {item.rankChange}
                </span>
              </div>

              <div className="rank-thumb" onClick={() => goDetail(item)}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className="rank-info" onClick={() => goDetail(item)}>
                <div className="rank-brand">{item.brand}</div>
                <div className="rank-name">{item.name}</div>

                <div className="rank-price">
                  <strong>₩{item.price.toLocaleString()}</strong>
                  <span className="before">₩{item.before.toLocaleString()}</span>
                  <span className="discount">{item.discount}</span>
                </div>

                <div className="rank-meta">
                  ❤️ {item.likes} 리뷰 {item.reviews}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
