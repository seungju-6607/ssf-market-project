// src/feature/market/InquiryPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { messageAPI } from "./messageAPI.js";
import "./market.css";
import { useMarketAuth } from "./authBridge.js";

export default function InquiryPanel({ listingId, sellerId, sellerName, onClose }) {
  const { isAuthenticated, user } = useMarketAuth();

  const [thread, setThread] = useState([]);
  const [text, setText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const boxRef = useRef(null);

  const buyerId = isAuthenticated ? (user.id || user.email) : `guest:${guestEmail || "anon"}`;
  const buyerName = isAuthenticated ? (user.name || user.email?.split("@")[0] || "USER") : (guestName || "GUEST");

  const load = async () => {
    const t = await messageAPI.getConversation({ listingId, buyerId, sellerId });
    setThread(t);
    setTimeout(() => boxRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 0);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [listingId, buyerId, sellerId]);

  const send = async (e) => {
    e.preventDefault();
    const body = String(text || "").trim();
    if (!body) return;
    if (!isAuthenticated && !guestEmail.trim()) {
      alert("비로그인 문의는 이메일이 필요합니다.");
      return;
    }
    await messageAPI.send({
      listingId,
      buyerId,
      sellerId,
      senderId: buyerId,
      senderName: buyerName,
      text: body,
    });
    setText("");
    await load();
  };

  return (
    <div className="mk-inquiry-wrap">
      <div className="mk-inquiry-head">
        <strong>판매자와 1:1 문의</strong>
        <button className="mk-btn" onClick={onClose}>닫기</button>
      </div>

      {!isAuthenticated && (
        <div className="mk-inquiry-guest">
          <label>이름
            <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="예) 손님" />
          </label>
          <label>이메일(필수)
            <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="예) guest@example.com" />
          </label>
        </div>
      )}

      <div ref={boxRef} className="mk-inquiry-thread">
        {thread.length === 0 ? (
          <div className="mk-empty">첫 메시지를 남겨보세요.</div>
        ) : (
          thread.map((m) => {
            const mine = m.senderId === buyerId;
            return (
              <div key={m.id} className={`mk-bubble ${mine ? "mine" : ""}`}>
                <div className="mk-bubble-meta">
                  <b>{mine ? "나" : m.senderName}</b> · {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mk-bubble-text">{m.text}</div>
              </div>
            );
          })
        )}
      </div>

      <form className="mk-inquiry-input" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지를 입력하세요" />
        <button className="mk-btn primary" type="submit">전송</button>
      </form>
    </div>
  );
}
