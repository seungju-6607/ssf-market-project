// src/pages/special/SpecialDetail.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SPECIAL_DATA } from "../../data/specialData";
import "./SpecialDetail.css";

export default function SpecialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const special = useMemo(
    () => SPECIAL_DATA.find((s) => String(s.id) === String(id)),
    [id]
  );

  const others = useMemo(() => {
    if (!special) return [];
    return SPECIAL_DATA.filter(
      (s) =>
        s.id !== special.id &&
        (s.brand === special.brand || s.type === special.type)
    ).slice(0, 3);
  }, [special]);

  if (!special) {
    return (
      <div className="spd-page">
        <p className="spd-notfound">해당 기획전을 찾을 수 없습니다.</p>
        <button className="spd-back" onClick={() => navigate("/special")}>
          ← 기획전 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="spd-page">
      <button className="spd-back" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <div className="spd-meta-top">
        <span className="spd-pill">{special.brand}</span>
        <span className="spd-pill spd-pill-outline">{special.type}</span>
        {special.status === "END" && (
          <span className="spd-pill spd-pill-end">종료된 기획전</span>
        )}
      </div>
      <h1 className="spd-title">{special.title}</h1>
      <p className="spd-period">{special.period}</p>
      <p className="spd-short">{special.shortDescription}</p>
      <div className="spd-hero">
        <img src={special.banner} alt={special.title} />
      </div>
      {special.benefits && special.benefits.length > 0 && (
        <section className="spd-section">
          <h2 className="spd-section-title">혜택 안내</h2>
          <ul className="spd-benefit-list">
            {special.benefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="spd-section">
        <h2 className="spd-section-title">기획전 상세</h2>
        <div className="spd-content">
          {(special.content && special.content.length > 0
            ? special.content
            : [
                "이 기획전은 더미 데이터입니다. 실제 서비스에서는 할인율, 유의사항, 쿠폰 사용 방법 등 상세 내용을 여기에 입력해 주세요."
              ]
          ).map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>
      {special.tags && special.tags.length > 0 && (
        <div className="spd-tags">
          {special.tags.map((t) => (
            <span key={t} className="spd-tag">
              #{t}
            </span>
          ))}
        </div>
      )}
      {others.length > 0 && (
        <section className="spd-section spd-related">
          <h2 className="spd-section-title">관련 기획전</h2>
          <div className="spd-related-grid">
            {others.map((s) => (
              <button
                key={s.id}
                className="spd-related-card"
                onClick={() => navigate(`/special/${s.id}`)}
              >
                <div className="spd-related-thumb">
                  <img src={s.banner} alt={s.title} />
                </div>
                <div className="spd-related-body">
                  <span className="spd-related-brand">{s.brand}</span>
                  <p className="spd-related-title">{s.title}</p>
                  <span className="spd-related-period">{s.period}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
