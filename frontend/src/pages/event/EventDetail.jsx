// src/pages/event/EventDetail.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EVENT_DATA } from "../../data/eventData";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = useMemo(
    () => EVENT_DATA.find((e) => String(e.id) === String(id)),
    [id]
  );

  const others = useMemo(() => {
    if (!event) return [];
    return EVENT_DATA.filter(
      (e) =>
        e.id !== event.id &&
        (e.category === event.category || e.channel === event.channel)
    ).slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <div className="evd-page">
        <p className="evd-notfound">해당 이벤트를 찾을 수 없습니다.</p>
        <button className="evd-back" onClick={() => navigate("/event")}>
          ← 이벤트 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="evd-page">
      <button className="evd-back" onClick={() => navigate(-1)}>
        ← 목록으로
      </button>

      <div className="evd-meta-top">
        <span className="evd-pill">{event.channel}</span>
        <span className="evd-pill evd-pill-outline">{event.category}</span>
        {event.status === "END" && (
          <span className="evd-pill evd-pill-end">종료된 이벤트</span>
        )}
      </div>

      <h1 className="evd-title">{event.title}</h1>
      <p className="evd-period">{event.period}</p>
      <p className="evd-short">{event.shortDescription}</p>

      <div className="evd-hero">
        <img src={event.banner} alt={event.title} />
      </div>

      {event.rewardSummary && (
        <section className="evd-section">
          <h2 className="evd-section-title">리워드 요약</h2>
          <p className="evd-reward-summary">{event.rewardSummary}</p>
        </section>
      )}

      {event.howToJoin && event.howToJoin.length > 0 && (
        <section className="evd-section">
          <h2 className="evd-section-title">참여 방법</h2>
          <ol className="evd-step-list">
            {event.howToJoin.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {event.rewards && event.rewards.length > 0 && (
        <section className="evd-section">
          <h2 className="evd-section-title">리워드 상세</h2>
          <ul className="evd-reward-list">
            {event.rewards.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </section>
      )}
      {event.notices && event.notices.length > 0 && (
        <section className="evd-section">
          <h2 className="evd-section-title">유의사항</h2>
          <ul className="evd-notice-list">
            {event.notices.map((n, idx) => (
              <li key={idx}>{n}</li>
            ))}
          </ul>
        </section>
      )}
      {event.tags && event.tags.length > 0 && (
        <div className="evd-tags">
          {event.tags.map((t) => (
            <span key={t} className="evd-tag">
              #{t}
            </span>
          ))}
        </div>
      )}
      {others.length > 0 && (
        <section className="evd-section evd-related">
          <h2 className="evd-section-title">다른 이벤트도 확인해보세요</h2>
          <div className="evd-related-grid">
            {others.map((e) => (
              <button
                key={e.id}
                className="evd-related-card"
                onClick={() => navigate(`/event/${e.id}`)}
              >
                <div className="evd-related-thumb">
                  <img src={e.banner} alt={e.title} />
                </div>
                <div className="evd-related-body">
                  <span className="evd-related-channel">{e.channel}</span>
                  <p className="evd-related-title">{e.title}</p>
                  <span className="evd-related-period">{e.period}</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
