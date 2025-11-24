// src/pages/magazine/MagazineList.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MAGAZINE_DATA } from "../../data/magazineData";
import "./MagazineList.css";

const CATEGORY_TABS = [
  { key: "ALL", label: "ALL" },
  { key: "WOMEN", label: "WOMEN" },
  { key: "MEN", label: "MEN" },
  { key: "UNISEX", label: "UNISEX" },
];

function groupByMonth(list) {
  const map = new Map();
  list.forEach((item) => {
    const key = item.monthLabel;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function MagazineList() {
  const [active, setActive] = useState("ALL");

  const filtered = useMemo(() => {
    if (active === "ALL") return MAGAZINE_DATA;
    return MAGAZINE_DATA.filter((m) => m.category === active);
  }, [active]);

  const grouped = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <div className="mgz-page">
      <h1 className="mgz-title">SSF MAGAZINE</h1>
      <p className="mgz-sub">시즌 트렌드와 브랜드 스토리를 한눈에.</p>

      <div className="mgz-tabs">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            className={
              "mgz-tab" + (active === tab.key ? " mgz-tab--active" : "")
            }
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {grouped.map(([month, items]) => (
        <section key={month} className="mgz-month">
          <h2 className="mgz-month-title">{month}</h2>

          <div className="mgz-grid">
            {items.map((m) => (
              <Link key={m.id} to={`/magazine/${m.id}`} className="mgz-card">
                <div className="mgz-thumb">
                  <img src={m.thumbnail} alt={m.title} />
                </div>

                <div className="mgz-body">
                  <span className="mgz-brand">{m.brand}</span>
                  <h3 className="mgz-ctitle">{m.title}</h3>
                  <p className="mgz-desc">{m.description}</p>

                  <div className="mgz-tags">
                    {m.tags.map((t) => (
                      <span key={t} className="mgz-tag">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
