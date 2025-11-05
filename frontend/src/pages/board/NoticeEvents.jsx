import React, { useMemo, useState } from "react";
import "./NoticeEvents.css";

/** 샘플 데이터 — 실제 API 연동 시 이 구조에 맞춰 맵핑만 바꾸면 됨 */
const SAMPLE_EVENTS = [
  {
    id: "ev1",
    img: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1200&auto=format&fit=crop",
    title: "첫 구매 한정 -50% 특가",
    desc: "10주년 기념 최대 혜택 받아가세요",
    badge: "10th",
  },
  {
    id: "ev2",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    title: "10주년 한정 첫 구매 지원금",
    desc: "매월 100명에게 선물로 1만 포인트 드립니다",
    badge: "Point",
  },
  {
    id: "ev3",
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
    title: "앱에서 첫 로그인하고 쿠폰 받기",
    desc: "1만원 쿠폰 즉시 지급",
    badge: "App",
  },
];

const SAMPLE_NOTICES = [
  { id: 18, title: "10/21 시에 라이브 구매인증 당첨자 안내", date: "2025.10.21" },
  { id: 17, title: "9/23 세인트제임스 LIVE 페이백 지급안내", date: "2025.10.21" },
  { id: 16, title: "9월 BOOST YOUR ENERGY 이벤트 당첨자 발표", date: "2025.10.17" },
  { id: 15, title: "10주년 ‘매치 업 플래닛 GAME’ 이벤트", date: "2025.10.17" },
  { id: 14, title: "9/18 에싸 라이브 페이백 및 사은품 당첨자 발표 - 1차", date: "2025.10.15" },
  { id: 13, title: "SSF SHOP 이용약관 변경 사전 안내", date: "2025.10.15" },
  { id: 12, title: "9/22 립바이즈 LIVE 페이백 및 사은품 당첨자 발표", date: "2025.10.15" },
  { id: 11, title: "9/24 리바이스 LIVE 페이백 지급안내", date: "2025.10.14" },
];

export default function NoticeEvents() {
  const [tab, setTab] = useState("event");
  const [q, setQ] = useState("");

  const filteredEvents = useMemo(() => {
    const term = q.trim();
    if (!term || tab !== "event") return SAMPLE_EVENTS;
    return SAMPLE_EVENTS.filter((e) =>
      (e.title + e.desc).toLowerCase().includes(term.toLowerCase())
    );
  }, [q, tab]);

  const filteredNotices = useMemo(() => {
    const term = q.trim();
    if (!term || tab !== "notice") return SAMPLE_NOTICES;
    return SAMPLE_NOTICES.filter((n) =>
      n.title.toLowerCase().includes(term.toLowerCase())
    );
  }, [q, tab]);

  return (
    <div className="ne-wrap">
      <div className="ne-breadcrumb">Home  ›  고객센터  ›  공지사항/이벤트</div>

      <h1 className="ne-title">공지사항 / 이벤트</h1>

      {/* 탭 + 검색 */}
      <div className="ne-controls">
        <div className="ne-tabs" role="tablist" aria-label="공지/이벤트 탭">
          <button
            className={`ne-tab ${tab === "event" ? "is-active" : ""}`}
            onClick={() => setTab("event")}
            role="tab"
            aria-selected={tab === "event"}
          >
            이벤트
          </button>
          <button
            className={`ne-tab ${tab === "notice" ? "is-active" : ""}`}
            onClick={() => setTab("notice")}
            role="tab"
            aria-selected={tab === "notice"}
          >
            공지사항
          </button>
        </div>

        <div className="ne-search">
          <input
            placeholder={`${tab === "event" ? "이벤트" : "공지사항"} 검색`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button className="ne-clear" onClick={() => setQ("")} aria-label="검색어 지우기">
              ×
            </button>
          )}
          <button className="ne-search-btn">검색</button>
        </div>
      </div>

      {/* 콘텐츠 */}
      {tab === "event" ? (
        <section className="ne-card-grid" aria-label="이벤트 목록">
          {filteredEvents.map((ev) => (
            <article key={ev.id} className="ne-card">
              <div className="ne-card-img">
                <img src={ev.img} alt={ev.title} />
                {ev.badge && <span className="ne-badge">{ev.badge}</span>}
              </div>
              <div className="ne-card-body">
                <h3 className="ne-card-title">{ev.title}</h3>
                <p className="ne-card-desc">{ev.desc}</p>
              </div>
            </article>
          ))}
          {filteredEvents.length === 0 && (
            <div className="ne-empty">검색 결과가 없습니다.</div>
          )}
        </section>
      ) : (
        <section className="ne-table-wrap" aria-label="공지사항 목록">
          <table className="ne-table">
            <colgroup>
              <col style={{ width: "80px" }} />
              <col />
              <col style={{ width: "140px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="ne-empty">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                filteredNotices.map((n) => (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td className="ne-title-cell">
                      <button className="ne-link" onClick={() => alert("상세 연결")}>
                        {n.title}
                      </button>
                    </td>
                    <td>{n.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
