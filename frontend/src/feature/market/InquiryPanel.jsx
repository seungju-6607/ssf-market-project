// src/feature/market/InquiryPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import { messageAPI } from "./messageAPI.js";
import "./market.css";
import { useMarketAuth } from "./authBridge.js";

export default function InquiryPanel({ fleaKey, sellerId, fleaName, onClose }) {
  const { isAuthenticated, user } = useMarketAuth();

  const [thread, setThread] = useState([]);
  const [text, setText] = useState("");

  const boxRef = useRef(null);
  const userId = isAuthenticated ? (user.id || user.email) : null;
  const userName = isAuthenticated ? (user.name || user.email?.split("@")[0] || "USER") : "GUEST";

  const load = async () => {
    if (!isAuthenticated) return; // 비회원 막음
    const t = await messageAPI.getConversation({ fleaKey, buyerId: userId, sellerId });
    setThread(t);
    setTimeout(() => boxRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 0);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [fleaKey, sellerId]);

  const send = async (e) => {
    e.preventDefault();
    const body = String(text || "").trim();
    if (!body) return;

    await messageAPI.send({
      fleaKey,
      buyerId: userId, // 서버에서는 buyerId 기준
      sellerId,
      senderId: userId,
      senderName: userName,
      inquiryMsg: body,
    });
    setText("");
    await load();
  };
console.log("thread : ", thread)
  return (
    <div className="mk-inquiry-wrap">
      <div className="mk-inquiry-head">
        <strong>판매자와 1:1 문의</strong>
        <button className="mk-btn" onClick={onClose}>닫기</button>
      </div>

      <div ref={boxRef} className="mk-inquiry-thread">
        {thread.length === 0 ? (
          <div className="mk-empty">첫 메시지를 남겨보세요.</div>
        ) : (
          thread.map((m) => {
            const mine = m.senderId === userId;
            return (
              <div key={m.msgId} className={`mk-bubble ${mine ? "mine" : ""}`}>
                <div className="mk-bubble-meta">
                  <b>{mine ? "나" : m.senderName}</b> · {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mk-bubble-text">{m.inquiryMsg}</div>
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
