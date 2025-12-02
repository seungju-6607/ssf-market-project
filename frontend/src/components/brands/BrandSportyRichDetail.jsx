import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandsportyrich.css";
import { buyNow } from "../../utils/buynow";

/** 외부/내부 이미지 경로 안전 보정 */
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/** 샘플 상품 – 실제 데이터로 교체 가능 */
const hotItems = [
  {
    id: "sr_001",
    name: "SPORTY & RICH 클래식 로고 티셔츠",
    price: 99000,
    image: "images/brands/sportyrich/hot_tee.webp",
    tag: "NEW",
  },
  {
    id: "sr_002",
    name: "SPORTY & RICH 스웻셔츠",
    price: 179000,
    image: "images/brands/sportyrich/hot_sweat.webp",
    tag: "BEST",
  },
  {
    id: "sr_003",
    name: "SPORTY & RICH 데님 팬츠",
    price: 219000,
    image: "images/brands/sportyrich/hot_jeans.webp",
    tag: "HOT",
  },
  {
    id: "sr_004",
    name: "SPORTY & RICH 볼캡",
    price: 69000,
    image: "images/brands/sportyrich/hot_cap.webp",
  },
];

const lookbook = [
  "images/brands/sportyrich/look1.webp",
  "images/brands/sportyrich/look2.webp",
  "images/brands/sportyrich/look3.webp",
  "images/brands/sportyrich/look4.webp",
];

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandSportyRichDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => hotItems.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 사이즈 선택 상태
  const [openSku, setOpenSku] = useState(null);
  const [pickedSize, setPickedSize] = useState({}); // { [sku]: "M" }

  const openPicker = (sku) => {
    setOpenSku((prev) => (prev === sku ? null : sku));
  };

  const onPickSize = (sku, size) => {
    setPickedSize((prev) => ({ ...prev, [sku]: size }));
  };

  const onBuy = (p) => {
    const size = pickedSize[p.id];
    if (!size) return; // 방어
    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.image },
      1,
      navigate,
      { size }
    );
  };

  return (
    <div className="brand-sr">
      {/* HERO (풀 이미지 + 오버레이) */}
      <section className="sr-hero with-image">
        <div
          className="sr-hero-bg"
          style={{
            backgroundImage: `url("${srcOf(
              "images/brands/sportyrich/hero_main.webp"
            )}")`,
          }}
        />
        <div className="sr-hero-overlay" />
        <div className="sr-hero-inner">
          <div className="sr-hero-badge">SPORTY &amp; RICH</div>
          <h1 className="sr-hero-title">편안함 속의 미니멀, SPORTY &amp; RICH</h1>
          <p className="sr-hero-desc">
            건강한 라이프스타일과 심플한 실루엣으로 완성된 캡슐 컬렉션을 만나보세요.
          </p>

          <div className="sr-hero-cta">
            <Link to="/category?brand=sportyrich" className="sr-btn sr-btn-primary">
              전체 상품 보기
            </Link>
            <a href="#benefits" className="sr-btn sr-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="sr-hero-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(total / 1000).toLocaleString()}K</strong>
              <span>합계 가격(참고)</span>
            </li>
            <li>
              <strong>F/W</strong>
              <span>이벤트 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="sr-section">
        <div className="sr-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=sportyrich" className="link-more">
            더보기
          </Link>
        </div>

        <div className="sr-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article className="sr-card" key={p.id}>
                <div className="sr-thumb">
                  {p.tag && (
                    <div className="sr-badges">
                      <span className={`bdg ${p.tag.toLowerCase()}`}>{p.tag}</span>
                    </div>
                  )}
                  <img
                    src={srcOf(p.image)}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    alt={p.name}
                  />
                </div>

                <div className="sr-meta">
                  <div className="sr-name">{p.name}</div>
                  <div className="sr-price">₩{Number(p.price || 0).toLocaleString()}</div>

                  {/* 기본 액션 */}
                  <div className="sr-actions">
                    <Link to={`/product/${p.id}`} className="sr-small-btn">
                      자세히
                    </Link>
                    <button
                      type="button"
                      className="sr-small-btn sr-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="sr-sizebox">
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
                          className="sr-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`sr-small-btn sr-small-primary ${!curSize ? "disabled" : ""}`}
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

      {/* 신규 회원 혜택 */}
      <section id="benefits" className="sr-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <Link to="/signup" className="sr-btn sr-btn-primary">
                회원가입
              </Link>
              <Link to="/mypage/coupons" className="sr-btn sr-btn-ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료 (정책 준수)</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="sr-section">
        <div className="sr-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="sr-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
                alt={`look ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 매장/안내 */}
      <section className="sr-section">
        <div className="sr-head">
          <h2>SPORTY &amp; RICH 오프라인</h2>
        </div>
        <div className="sr-store">
          <div className="store-card">
            <div className="tit">단독 팝업/편집숍</div>
            <p>브랜드 무드를 더 가까이, 전개 매장을 확인하세요.</p>
            <button className="sr-btn sr-btn-ghost">매장 찾기</button>
          </div>
          <div className="store-card">
            <div className="tit">A/S &amp; 케어</div>
            <p>케어 가이드와 세탁 팁을 확인해 제품을 오래 입어보세요.</p>
            <button className="sr-btn sr-btn-ghost">가이드 보기</button>
          </div>
        </div>
      </section>
    </div>
  );
}
