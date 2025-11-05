import React, { useEffect } from "react";
import "./EmailPolicyModal.css";

export default function EmailPolicyModal({ open, onClose }) {
  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className="ep-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ep-title">
      <div className="ep-modal" onClick={stop}>
        <button className="ep-close" aria-label="닫기" onClick={onClose}>×</button>

        <h2 id="ep-title" className="ep-title">이메일 무단수집 거부</h2>

        <div className="ep-icon" aria-hidden="true">
          {/* ⛔ 아이콘 (CSS 원형+슬래시) */}
          <span className="ep-ban" />
        </div>

        <p className="ep-desc">
          본 사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여
          무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망법」에 의해 형사 처벌됨을 유념하시기 바랍니다.
        </p>

        <div className="ep-date">게시일 : 2025. 10. 27</div>

        <div className="ep-actions">
          <button className="ep-btn" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}
