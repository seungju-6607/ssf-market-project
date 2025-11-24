// src/pages/special/SpecialList.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SPECIAL_DATA } from "../../data/specialData";
import "./SpecialList.css";

const TYPE_TABS = [
  { key: "ALL", label: "전체" },
  { key: "SALE", label: "세일" },
  { key: "EVENT", label: "이벤트" },
  { key: "COUPON", label: "쿠폰" },
  { key: "BRAND", label: "브랜드" }
];

export default function SpecialList() {
  const [activeType, setActiveType] = useState("ALL");
  const [showEnded, setShowEnded] = useState(false);

  const filteredList = useMemo(() => {
    let list = SPECIAL_DATA;

    if (!showEnded) {
      list = list.filter((s) => s.status === "ING");
    }
    if (activeType !== "ALL") {
      list = list.filter((s) => s.type === activeType);
    }

    // 진행중 먼저, 그다음 종료된 기획전
    return [...list].sort((a, b) => {
      if (a.status === b.status) return a.id - b.id;
      return a.status === "ING" ? -1 : 1;
    });
  }, [activeType, showEnded]);

  return (
    <div className="sp-page">
      <div className="sp-header">
        <h1 className="sp-title">기획전</h1>
        <p className="sp-sub">
          시즌 한정 할인, 쿠폰, 브랜드 단독 기획전을 한 곳에서 만나보세요.
        </p>
      </div>

      {/* 타입 탭 */}
      <div className="sp-tabs">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={
              "sp-tab-btn" +
              (activeType === tab.key ? " sp-tab-btn--active" : "")
            }
            onClick={() => setActiveType(tab.key)}
          >
            {tab.label}
          </button>
        ))}

        <label className="sp-ended-toggle">
          <input
            type="checkbox"
            checked={showEnded}
            onChange={(e) => setShowEnded(e.target.checked)}
          />
          <span>종료된 기획전 포함</span>
        </label>
      </div>

      {/* 리스트 */}
      <div className="sp-list">
        {filteredList.map((sp) => (
          <Link
            key={sp.id}
            to={`/special/${sp.id}`}
            className={
              "sp-card" + (sp.status === "END" ? " sp-card--ended" : "")
            }
          >
            <div className="sp-banner-wrap">
              <img src={sp.banner} alt={sp.title} />
              <div className="sp-banner-badge-row">
                {sp.badge && <span className="sp-badge">{sp.badge}</span>}
                {sp.status === "END" && (
                  <span className="sp-badge sp-badge--end">종료된 기획전</span>
                )}
              </div>
            </div>

            <div className="sp-body">
              <div className="sp-meta-row">
                <span className="sp-brand">{sp.brand}</span>
                <span className="sp-period">{sp.period}</span>
              </div>
              <h2 className="sp-card-title">{sp.title}</h2>
              <p className="sp-card-desc">{sp.shortDescription}</p>

              <ul className="sp-benefit-list">
                {sp.benefits.slice(0, 3).map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}

        {filteredList.length === 0 && (
          <div className="sp-empty">조건에 맞는 기획전이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
