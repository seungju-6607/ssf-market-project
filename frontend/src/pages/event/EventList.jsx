// src/pages/event/EventList.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EVENT_DATA } from "../../data/eventData";
import "./EventList.css";

const CATEGORY_TABS = [
  { key: "ALL", label: "전체" },
  { key: "ATTEND", label: "출석" },
  { key: "MISSION", label: "미션" },
  { key: "DRAW", label: "응모" },
  { key: "COMMENT", label: "댓글/리뷰" },
  { key: "COUPON", label: "쿠폰" }
];

export default function EventList() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [showEnded, setShowEnded] = useState(false);

  const filteredList = useMemo(() => {
    let list = EVENT_DATA;

    if (!showEnded) {
      list = list.filter((e) => e.status === "ING");
    }
    if (activeCategory !== "ALL") {
      list = list.filter((e) => e.category === activeCategory);
    }

    return [...list].sort((a, b) => {
      if (a.status === b.status) return a.id - b.id;
      return a.status === "ING" ? -1 : 1;
    });
  }, [activeCategory, showEnded]);

  return (
    <div className="ev-page">
      <div className="ev-header">
        <h1 className="ev-title">이벤트</h1>
        <p className="ev-sub">
          출석·미션·응모·댓글 이벤트 등 다양한 참여형 혜택을 만나보세요.
        </p>
      </div>
      <div className="ev-tabs-row">
        <div className="ev-tabs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              className={
                "ev-tab-btn" +
                (activeCategory === tab.key ? " ev-tab-btn--active" : "")
              }
              onClick={() => setActiveCategory(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="ev-ended-toggle">
          <input
            type="checkbox"
            checked={showEnded}
            onChange={(e) => setShowEnded(e.target.checked)}
          />
          <span>종료된 이벤트 포함</span>
        </label>
      </div>
      <div className="ev-list">
        {filteredList.map((ev) => (
          <Link
            key={ev.id}
            to={`/event/${ev.id}`}
            className={
              "ev-card" + (ev.status === "END" ? " ev-card--ended" : "")
            }
          >
            <div className="ev-banner-wrap">
              <img src={ev.banner} alt={ev.title} />
              <div className="ev-banner-badges">
                {ev.badge && <span className="ev-badge">{ev.badge}</span>}
                {ev.status === "END" && (
                  <span className="ev-badge ev-badge--end">종료</span>
                )}
              </div>
            </div>

            <div className="ev-body">
              <div className="ev-meta-top">
                <span className="ev-channel">{ev.channel}</span>
                <span className="ev-period">{ev.period}</span>
              </div>
              <h2 className="ev-card-title">{ev.title}</h2>
              <p className="ev-card-desc">{ev.shortDescription}</p>
              <p className="ev-reward">{ev.rewardSummary}</p>
            </div>
          </Link>
        ))}

        {filteredList.length === 0 && (
          <div className="ev-empty">조건에 맞는 이벤트가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
