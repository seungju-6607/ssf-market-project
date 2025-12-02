// frontend/src/components/brands/BrandLemaireDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandlemaire.css";
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

const SIZES = ["XS", "S", "M", "L"];

/* LEMAIRE 샘플 상품 */
const hotItems = [
  {
    id: "lm-coat",
    name: "LEMAIRE 오버사이즈 코트",
    price: 890000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "lm-trench",
    name: "LEMAIRE 벨티드 트렌치 코트",
    price: 950000,
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "lm-knit",
    name: "LEMAIRE 울 블렌드 니트",
    price: 459000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "lm-shirt",
    name: "LEMAIRE 릴랙스드 셔츠",
    price: 329000,
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandLemaireDetail() {
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
    <div className="brand-lm">
      {/* HERO */}
      <section className="lm-hero with-image">
        <div
          className="lm-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="lm-hero-overlay" />
        <div className="lm-hero-inner">
          <div className="lm-hero-badge">LEMAIRE</div>
          <h1 className="lm-hero-title">조용한 럭셔리, LEMAIRE</h1>
          <p className="lm-hero-desc">
            부드러운 실루엣과 자연스러운 컬러 팔레트. 르메르 특유의 절제된
            무드를 느껴보세요.
          </p>

          <div className="lm-hero-cta">
            <Link to="/category?brand=lemaire" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#lm-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="lm-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>MINIMAL</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="lm-section">
        <div className="lm-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=lemaire" className="link-more">
            더보기
          </Link>
        </div>

        <div className="lm-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="lm-card" key={p.id}>
                <div className="lm-thumb">
                  {p.badges?.length ? (
                    <div className="lm-badges">
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

                <div className="lm-meta">
                  <div className="lm-name">{p.name}</div>
                  <div className="lm-price">{fmt(p.price)}</div>

                  <div className="lm-actions">
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
      <section id="lm-benefits" className="lm-benefit">
        <div className="inner">
          <div className="signup-card lm-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>LEMAIRE 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 코트·니트 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">뉴트럴 팔레트</div>
              <p>톤 다운된 베이지·브라운·카키 컬러 구성.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">유연한 실루엣</div>
              <p>레이어드에 최적화된 릴랙스 핏.</p>
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
      <section className="lm-section">
        <div className="lm-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="lm-lookbook">
          {lookbook.map((src, i) => (
            <div className="lm-card-img" key={i}>
              <img src={srcOf(src)} alt={`lemaire-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
