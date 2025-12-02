// src/feature/market/InquiryPanelSeller.jsx
import React, { useEffect, useRef, useState } from "react";
import { messageAPI } from "./messageAPI";
import "./market.css";
import { useMarketAuth } from "./authBridge";

export default function InquiryPanelSeller({ fleaKey, buyerId, onClose }) {
  const { isAuthenticated, user } = useMarketAuth();

  const [thread, setThread] = useState([]);
  const [text, setText] = useState("");

  const boxRef = useRef(null);

  const sellerId = user?.id || user?.email;
  const sellerName =
    user?.name || sellerId?.split("@")[0] || "판매자";

  const load = async () => {
    if (!sellerId) return;
    const list = await messageAPI.getConversation({
      fleaKey,
      buyerId,
      sellerId,
    });

    setThread(list);
    setTimeout(() => {
      boxRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [fleaKey, buyerId, isAuthenticated]);

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !sellerId) return;

    await messageAPI.send({
      fleaKey,
      buyerId,
      sellerId,
      senderId: sellerId,
      senderName: sellerName,
      inquiryMsg: body,
    });

    setText("");
    await load();
  };

  if (!isAuthenticated) {
    return (
      <div className="mk-inquiry-wrap">
        <div className="mk-inquiry-head">
          <strong>판매자 문의</strong>
          <button className="mk-btn" onClick={onClose}>닫기</button>
        </div>
        <div className="mk-empty">판매자 로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="mk-inquiry-wrap">
      <div className="mk-inquiry-head">
        <strong>구매자와 1:1 대화</strong>
        <button className="mk-btn" onClick={onClose}>닫기</button>
      </div>

      <div ref={boxRef} className="mk-inquiry-thread">
        {thread.length === 0 ? (
          <div className="mk-empty">메시지가 없습니다.</div>
        ) : (
          thread.map((m) => {
            const mine = m.senderId === sellerId;
            return (
              <div key={m.msgId} className={`mk-bubble ${mine ? "mine" : ""}`}>
                <div className="mk-bubble-meta">
                  <b>{mine ? "나(판매자)" : m.senderName}</b> ·{" "}
                  {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mk-bubble-text">{m.inquiryMsg}</div>
              </div>
            );
          })
        )}
      </div>

      <form className="mk-inquiry-input" onSubmit={send}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="판매자 답변 입력"
        />
        <button className="mk-btn primary" type="submit">전송</button>
      </form>
    </div>
  );
}
