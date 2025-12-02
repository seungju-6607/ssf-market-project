// frontend/src/components/brands/BrandSaintJamesDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandsaintjames.css";
import { buyNow } from "../../utils/buynow";

/* 숫자/가격 유틸 */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const SIZES = ["XS", "S", "M", "L", "XL"];

/* SAINT JAMES 샘플 상품 */
const hotItems = [
  {
    id: "sj-breton",
    name: "SAINT JAMES 클래식 브레통 셔츠",
    price: 129000,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "sj-knit",
    name: "SAINT JAMES 머린 니트",
    price: 189000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "sj-coat",
    name: "SAINT JAMES 피코트",
    price: 259000,
    img: "https://images.unsplash.com/photo-1512428232642-268d98a0844e?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "sj-beanie",
    name: "SAINT JAMES 머린 비니",
    price: 49000,
    img: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandSaintJamesDetail() {
  const navigate = useNavigate();
  const [openSku, setOpenSku] = useState(null);
  const [picked, setPicked] = useState({});

  const sum = useMemo(
    () => hotItems.reduce((acc, cur) => acc + toNum(cur.price), 0),
    []
  );

  const openPicker = (sku) => setOpenSku((v) => (v === sku ? null : sku));
  const onPick = (sku, s) => setPicked((p) => ({ ...p, [sku]: s }));

  const onBuy = (p) => {
    const size = picked[p.id];
    if (!size) return;
    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.img },
      1,
      navigate,
      { size }
    );
  };

  return (
    <div className="brand-sj">
      {/* HERO */}
      <section className="sj-hero with-image">
        <div
          className="sj-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="sj-hero-overlay" />
        <div className="sj-hero-inner">
          <div className="sj-hero-badge">SAINT JAMES</div>
          <h1 className="sj-hero-title">프렌치 머린 룩의 원조, SAINT JAMES</h1>
          <p className="sj-hero-desc">
            노르망디 해안에서 시작된 세인트 제임스. 아이코닉한 스트라이프와
            탄탄한 짜임으로 완성하는 정통 머린 스타일.
          </p>

          <div className="sj-hero-cta">
            <Link to="/category?brand=saintjames" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#sj-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="sj-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>MARINE</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="sj-section">
        <div className="sj-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=saintjames" className="link-more">
            더보기
          </Link>
        </div>

        <div className="sj-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="sj-card" key={p.id}>
                <div className="sj-thumb">
                  {p.badges?.length ? (
                    <div className="sj-badges">
                      {p.badges.map((b) => (
                        <span key={b} className={`bdg ${b.toLowerCase()}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <img
                    src={srcOf(p.img)}
                    alt={p.name}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>

                <div className="sj-meta">
                  <div className="sj-name">{p.name}</div>
                  <div className="sj-price">{fmt(p.price)}</div>

                  <div className="sj-actions">
                    <Link to={`/product/${p.id}`} className="btn ghost">
                      자세히
                    </Link>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {opened && (
                    <div className="sizebox">
                      <div className="sizebox-title">사이즈 선택</div>
                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`sizebox-chip ${
                              size === s ? "active" : ""
                            }`}
                            onClick={() => onPick(p.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="sizebox-actions">
                        <button
                          type="button"
                          className="btn ghost"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className="btn primary"
                          disabled={!size}
                          onClick={() => onBuy(p)}
                        >
                          구매 진행
                        </button>
                      </div>
                      {!size && (
                        <div className="sizebox-warn">
                          사이즈를 선택해주세요
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BENEFIT */}
      <section id="sj-benefits" className="sj-benefit">
        <div className="inner">
          <div className="signup-card sj-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>SAINT JAMES 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <Link to="/signup" className="btn primary">
                회원가입
              </Link>
              <Link to="/mypage/coupons" className="btn ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="benefit-card">
              <div className="tit">정통 브레통 스트라이프</div>
              <p>100년 넘게 이어진 아이코닉 스트라이프 패턴.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">탄탄한 니트</div>
              <p>거친 바다 바람도 버티는 헤리티지 짜임.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="sj-section">
        <div className="sj-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="sj-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`saintjames-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
