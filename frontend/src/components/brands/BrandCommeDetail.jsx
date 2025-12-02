import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandcomme.css"; // 꼼데 전용 스타일
import { buyNow } from "../../utils/buynow"; // 공용 유틸 (프로젝트에 없으면 기존 방식대로 checkout 링크로 유지하세요)

/** 안전한 이미지 경로 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) {
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  }
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

// 샘플 아이템 (원하면 실제 데이터로 교체)
const items = [
  {
    id: "cdg_001",
    name: "CDG 하트 로고 티셔츠",
    price: 129000,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "cdg_002",
    name: "CDG 스트라이프 셔츠",
    price: 289000,
    image:
      "https://images.unsplash.com/photo-1514952518794-9a69a7d2d77e?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "cdg_003",
    name: "CDG 페플럼 자켓",
    price: 519000,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
    tag: "FW",
  },
  {
    id: "cdg_004",
    name: "CDG 테일러드 팬츠",
    price: 329000,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80&auto=format&fit=crop",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80&auto=format&fit=crop",
];

// 간단 사이즈 목록 (원하시면 브랜드별로 다르게 세팅 가능)
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandCommeDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => items.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 사이즈 picker 상태
  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 id
  const [pickedSize, setPickedSize] = useState({}); // { [sku]: "M" }

  const openPicker = (sku) => {
    setOpenSku((prev) => (prev === sku ? null : sku));
  };

  const onPickSize = (sku, size) => {
    setPickedSize((prev) => ({ ...prev, [sku]: size }));
  };

  const onBuy = (p) => {
    const size = pickedSize[p.id];
    if (!size) return; // 안전장치

    // buyNow(상품, 수량, navigate, 옵션)
    // 프로젝트에 buyNow가 있으면 이 호출이 동작합니다.
    // 만약 없을 경우 navigate(`/checkout?sku=${p.id}&qty=1&size=${size}`)로 변경해 사용하세요.
    try {
      buyNow(
        {
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
        },
        1,
        navigate,
        { size }
      );
    } catch (e) {
      // buyNow 유틸이 없는 환경을 대비해 폴백으로 checkout으로 이동
      navigate(`/checkout?sku=${p.id}&qty=1&size=${encodeURIComponent(size)}`);
    }
  };

  return (
    <div className="brandcdg">
      {/* HERO */}
      <section className="brandcdg-hero">
        <div className="brandcdg-hero-inner">
          <div className="brandcdg-badge">COMME des GARÇONS</div>
          <h1 className="brandcdg-title">
            아방가르드의 아이콘, <span>CDG</span>
          </h1>
          <p className="brandcdg-sub">
            실험적인 실루엣과 스트릿 감성의 결합. 꼼데가르송의 독보적인 무드를 만나보세요.
          </p>

          <div className="brandcdg-cta">
            <Link
              to="/category?brand=comme"
              className="brandcdg-btn brandcdg-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandcdg-btn brandcdg-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandcdg-stats">
            <li>
              <strong>{items.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(total / 1000).toLocaleString()}K</strong>
              <span>합계 가격(참고)</span>
            </li>
            <li>
              <strong>F/W</strong>
              <span>이번 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 추천 상품 */}
      <section className="brandcdg-section">
        <div className="brandcdg-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=comme" className="brandcdg-more">
            더 보기
          </Link>
        </div>

        <div className="brandcdg-grid">
          {items.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandcdg-card">
                <div className="brandcdg-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandcdg-tag">{p.tag}</span>}
                </div>
                <div className="brandcdg-card-body">
                  <h3 className="brandcdg-name">{p.name}</h3>
                  <div className="brandcdg-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>
                  <div className="brandcdg-actions">
                    <Link to={`/product/${p.id}`} className="brandcdg-small-btn">
                      자세히
                    </Link>

                    {/* 바로구매 버튼: 사이즈 선택 토글 */}
                    <button
                      type="button"
                      className="brandcdg-small-btn brandcdg-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 (열렸을 때만 렌더) */}
                  {opened && (
                    <div className="brandcdg-sizebox">
                      <div className="sizebox-title">사이즈 선택</div>
                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`sizebox-chip ${curSize === s ? "active" : ""}`}
                            onClick={() => onPickSize(p.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="sizebox-actions">
                        <button
                          type="button"
                          className="brandcdg-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandcdg-small-btn brandcdg-small-primary ${!curSize ? "disabled" : ""}`}
                          onClick={() => onBuy(p)}
                          disabled={!curSize}
                        >
                          구매 진행
                        </button>
                      </div>

                      {!curSize && (
                        <div className="sizebox-warn">사이즈를 선택해주세요</div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BENEFIT(공용 없이 단일) */}
      <section id="benefits" className="cdg-benefit">
        <div className="inner">
          <div className="benefit-head">
            <div>
              <div className="benefit-eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="benefit-cta">
              <Link to="/signup" className="btn b-solid">
                회원가입
              </Link>
              <Link to="/mypage/coupons" className="btn b-ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-item">
              <strong>멤버십등급 추가적립</strong>
              <span>구매 금액대별 최대 5% 포인트 적립</span>
            </div>
            <div className="benefit-item">
              <strong>오늘 출발</strong>
              <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
            </div>
            <div className="benefit-item">
              <strong>무료 반품</strong>
              <span>사이즈/컬러 교환 1회 무료(정책 참조)</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandcdg-section">
        <div className="brandcdg-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandcdg-more">F/W STYLING</span>
        </div>

        <div className="brandcdg-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandcdg-section">
        <div className="brandcdg-section-head">
          <h2>COMME des GARÇONS 오프라인</h2>
        </div>
        <div className="brandcdg-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>꼼데가르송 라인업을 현장에서 직접 경험해보세요.</p>
            <a
              className="brandcdg-btn brandcdg-btn-ghost store-map-link"
              href="https://map.naver.com/"
              target="_blank"
              rel="noreferrer"
            >
              길찾기
            </a>
          </div>
          <div className="store-map">
            <img
              src={srcOf(
                "https://images.unsplash.com/photo-1506377711776-4a26f78c5d07?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
