// frontend/src/components/brands/BrandGalaxyLifestyleDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandgalaxylifestyle.css";
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

const SIZES = ["S", "M", "L", "XL"];

/* GLXY GALAXY LIFESTYLE 샘플 상품 */
const hotItems = [
  {
    id: "glxy-windbreaker",
    name: "GLXY 리플렉티브 윈드브레이커",
    price: 159000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "glxy-hoodie",
    name: "GLXY 그래픽 후디",
    price: 89000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "glxy-jogger",
    name: "GLXY 라인 조거 팬츠",
    price: 79000,
    img: "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "glxy-cap",
    name: "GLXY 네온 캡",
    price: 39000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandGalaxyLifestyleDetail() {
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
    <div className="brand-glxy">
      {/* HERO */}
      <section className="glxy-hero with-image">
        <div
          className="glxy-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="glxy-hero-overlay" />
        <div className="glxy-hero-inner">
          <div className="glxy-hero-badge">GLXY GALAXY LIFESTYLE</div>
          <h1 className="glxy-hero-title">도시 감성 애슬레저, GALAXY LIFESTYLE</h1>
          <p className="glxy-hero-desc">
            네온 사인과 도시 야경에서 영감을 받은 그래픽. 데일리로 입기 좋은
            애슬레저 무드를 GLXY 컬렉션으로 완성해 보세요.
          </p>

          <div className="glxy-hero-cta">
            <Link to="/category?brand=galaxylifestyle" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#glxy-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="glxy-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>URBAN</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="glxy-section">
        <div className="glxy-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=galaxylifestyle" className="link-more">
            더보기
          </Link>
        </div>

        <div className="glxy-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="glxy-card" key={p.id}>
                <div className="glxy-thumb">
                  {p.badges?.length ? (
                    <div className="glxy-badges">
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

                <div className="glxy-meta">
                  <div className="glxy-name">{p.name}</div>
                  <div className="glxy-price">{fmt(p.price)}</div>

                  <div className="glxy-actions">
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
      <section id="glxy-benefits" className="glxy-benefit">
        <div className="inner">
          <div className="signup-card glxy-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>GLXY 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 애슬레저 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">네온 포인트</div>
              <p>야간에도 돋보이는 리플렉티브 디테일.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">편안한 핏</div>
              <p>조거·후디 위주의 데일리 애슬레저.</p>
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
      <section className="glxy-section">
        <div className="glxy-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="glxy-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`glxy-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
