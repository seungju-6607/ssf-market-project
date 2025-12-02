// frontend/src/components/brands/BrandRebaigeDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandrebaige.css";
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

/* REBAIGE(LEBEIGE) 샘플 상품 */
const hotItems = [
  {
    id: "rb-trench",
    name: "REBAIGE 클래식 트렌치 코트",
    price: 459000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "rb-jacket",
    name: "REBAIGE 리넨 블렌드 재킷",
    price: 329000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "rb-dress",
    name: "REBAIGE 미니멀 랩 드레스",
    price: 289000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "rb-slack",
    name: "REBAIGE 와이드 슬랙스",
    price: 219000,
    img: "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandRebaigeDetail() {
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
    <div className="brand-rb">
      {/* HERO */}
      <section className="rb-hero with-image">
        <div
          className="rb-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="rb-hero-overlay" />
        <div className="rb-hero-inner">
          <div className="rb-hero-badge">REBAIGE</div>
          <h1 className="rb-hero-title">절제된 우아함, REBAIGE</h1>
          <p className="rb-hero-desc">
            부드러운 베이지 톤과 미니멀한 실루엣. 매일의 룩에 품격을 더해 줄
            컬렉션을 만나보세요.
          </p>

          <div className="rb-hero-cta">
            <Link to="/category?brand=rebaige" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#rb-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="rb-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
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
      <section className="rb-section">
        <div className="rb-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=rebaige" className="link-more">
            더보기
          </Link>
        </div>

        <div className="rb-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="rb-card" key={p.id}>
                <div className="rb-thumb">
                  {p.badges?.length ? (
                    <div className="rb-badges">
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

                <div className="rb-meta">
                  <div className="rb-name">{p.name}</div>
                  <div className="rb-price">{fmt(p.price)}</div>

                  <div className="rb-actions">
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
      <section id="rb-benefits" className="rb-benefit">
        <div className="inner">
          <div className="signup-card rb-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>REBAIGE 첫 구매 ₩20,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 프리미엄 라인 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">고급 원단</div>
              <p>울·리넨·실크 블렌드 등 프리미엄 소재 사용.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">타임리스 디자인</div>
              <p>유행을 타지 않는 미니멀 실루엣.</p>
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
      <section className="rb-section">
        <div className="rb-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="rb-lookbook">
          {lookbook.map((src, i) => (
            <div className="rb-card-img" key={i}>
              <img src={srcOf(src)} alt={`rebaige-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
