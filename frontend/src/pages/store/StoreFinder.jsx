import React, { useMemo, useState } from "react";
import "./StoreFinder.css";

export default function StoreFinder() {
  const name = "더좋은강남아카데미";
  const floor = "4층";
  const address = `${name} ${floor}`;

  const encoded = useMemo(() => encodeURIComponent(address), [address]);
  const [copied, setCopied] = useState(false);

  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="store-wrap">
      <div className="store-crumb">Home  ›  매장찾기</div>

      <section className="store-hero">
        <div className="aurora" aria-hidden="true" />
        <h1 className="store-title">매장찾기</h1>
        <p className="store-sub">
          가장 가까운 경로로 안내해 드릴게요. 아래 길찾기 버튼을 눌러 이동앱을 선택하세요.
        </p>
      </section>

      <section className="store-card">
        <div className="store-card-head">
          <div className="store-pin" aria-hidden="true">📍</div>
          <div className="store-name">
            <strong>{name}</strong>
            <span className="store-floor">{floor}</span>
          </div>
        </div>

        <div className="store-info-grid">
          <div className="store-info">
            <div className="info-row">
              <span className="info-key">주소</span>
              <span className="info-val">{address}</span>
              <button className="mini-btn" onClick={copyAddr}>
                {copied ? "복사됨!" : "주소복사"}
              </button>
            </div>

            <div className="info-row">
              <span className="info-key">영업시간</span>
              <span className="info-val">평일 10:00 ~ 19:00 (주말/공휴일 휴무)</span>
            </div>

            <div className="cta-wrap">
              <a
                className="cta-btn naver"
                href={`https://map.naver.com/p/search/${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                네이버 지도로 길찾기
              </a>
              <a
                className="cta-btn kakao"
                href={`https://map.kakao.com/?q=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                카카오맵으로 길찾기
              </a>
              <a
                className="cta-btn google"
                href={`https://www.google.com/maps/search/?api=1&query=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                구글 지도로 길찾기
              </a>
            </div>
          </div>

          <div className="store-map">
            {/* 구글 지도 임베드: 검색 결과 뷰 */}
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encoded}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="store-tips">
          🚗 자차 이용 시 목적지를 <b>{address}</b>로 설정해주세요.  
          대중교통 이용 시, 네이버/카카오 길찾기에서 실시간 환승 정보를 확인할 수 있어요.
        </div>
      </section>
    </div>
  );
}
