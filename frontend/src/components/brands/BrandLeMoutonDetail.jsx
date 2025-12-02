// frontend/src/components/brands/BrandLeMoutonDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandlemouton.css";
import { buyNow } from "../../utils/buynow";

/* 유틸 */
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

/** Le Mouton 샘플 상품 */
const hotItems = [
  {
    id: "lm-cardigan",
    name: "Le Mouton 울 가디건",
    price: 159000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "lm-coat",
    name: "Le Mouton 핸드메이드 코트",
    price: 329000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "lm-knit",
    name: "Le Mouton 브러시드 니트",
    price: 139000,
    img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "lm-scarf",
    name: "Le Mouton 캐시미어 머플러",
    price: 89000,
    img: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandLeMoutonDetail() {
  const navigate = useNavigate();

  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 ID
  const [picked, setPicked] = useState({}); // { sku: "M" }

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
              'url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="lm-hero-overlay" />
        <div className="lm-hero-inner">
          <div className="lm-hero-badge">Le Mouton</div>
          <h1 className="lm-hero-title">
            포근한 무드를 담은 니트웨어, Le Mouton
          </h1>
          <p className="lm-hero-desc">
            부드러운 터치와 담백한 실루엣으로 완성되는 데일리 니트웨어.
            Le Mouton과 함께 계절의 온도를 느껴보세요.
          </p>

          <div className="lm-hero-cta">
            <Link
              to="/category?brand=lemouton"
              className="btn primary hero-btn"
            >
              전체 상품 보기
            </Link>
            <a href="#lm-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="lm-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>WARM</strong>
              <span>니트 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="lm-section">
        <div className="lm-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=lemouton" className="link-more">
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
                  <div className="lm-price">{fmt(toNum(p.price))}</div>

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

                  {/* 사이즈 선택 박스 */}
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
              <h3>Le Mouton 니트 전용 첫 구매 10,000원 쿠폰</h3>
              <p>
                회원가입만 해도 Le Mouton 컬렉션에 즉시 사용 가능한 웰컴 쿠폰을
                드립니다.
              </p>
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
              <div className="tit">프리미엄 원사</div>
              <p>울·알파카·캐시미어 등 고급 원사 사용.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목 제외).</p>
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
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                alt={`look-${i}`}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
