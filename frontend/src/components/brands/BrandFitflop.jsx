// frontend/src/components/brands/BrandFitflop.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrandFitflop.css";
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

const SIZES = ["220", "230", "240", "250", "260"];

/* FITFLOP 샘플 상품 */
const hotItems = [
  {
    id: "ft-sandal-lulu",
    name: "FITFLOP 루루 글리터 샌들",
    price: 129000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ft-sandal-ikat",
    name: "FITFLOP 아이캣 프린트 슬라이드",
    price: 119000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ft-sneaker",
    name: "FITFLOP 울트라라이트 스니커즈",
    price: 149000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ft-sandal-basic",
    name: "FITFLOP 데일리 컴포트 샌들",
    price: 99000,
    img: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandFitflop() {
  const navigate = useNavigate();
  const [openSku, setOpenSku] = useState(null);
  const [picked, setPicked] = useState({});

  const sum = useMemo(
    () => hotItems.reduce((acc, cur) => acc + toNum(cur.price), 0),
    []
  );

  const openPicker = (sku) => setOpenSku((v) => (v === sku ? null : sku));
  const onPick = (sku, size) => setPicked((p) => ({ ...p, [sku]: size }));

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
    <div className="brand-ft">
      {/* HERO */}
      <section className="ft-hero with-image">
        <div
          className="ft-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ft-hero-overlay" />
        <div className="ft-hero-inner">
          <div className="ft-hero-badge">FITFLOP</div>
          <h1 className="ft-hero-title">하루 종일 편안한, FITFLOP</h1>
          <p className="ft-hero-desc">
            사람의 발을 가장 편안하게 만들어 주는 바닥 설계. 스타일과 쿠션감을
            동시에 즐길 수 있는 핏플랍 샌들을 만나보세요.
          </p>

          <div className="ft-hero-cta">
            <Link to="/category?brand=fitflop" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#ft-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="ft-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>COMFORT</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="ft-section">
        <div className="ft-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=fitflop" className="link-more">
            더보기
          </Link>
        </div>

        <div className="ft-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="ft-card" key={p.id}>
                <div className="ft-thumb">
                  {p.badges?.length ? (
                    <div className="ft-badges">
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

                <div className="ft-meta">
                  <div className="ft-name">{p.name}</div>
                  <div className="ft-price">{fmt(p.price)}</div>

                  <div className="ft-actions">
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
      <section id="ft-benefits" className="ft-benefit">
        <div className="inner">
          <div className="signup-card ft-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>FITFLOP 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 샌들·슬리퍼 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">인체공학적 바닥</div>
              <p>발의 곡선을 따라가는 미드솔 설계.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">가벼운 착화감</div>
              <p>하루 종일 신어도 편안한 경량 소재.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="ft-section">
        <div className="ft-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="ft-lookbook">
          {lookbook.map((src, i) => (
            <div className="ft-card-img" key={i}>
              <img src={srcOf(src)} alt={`fitflop-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
