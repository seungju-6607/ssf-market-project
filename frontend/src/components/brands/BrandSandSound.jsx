// frontend/src/components/brands/BrandSandSound.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrandSandSound.css";
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

/* 캐주얼 브랜드라 S/M/L/XL */
const SIZES = ["S", "M", "L", "XL"];

/* SAND SOUND 샘플 상품 */
const hotItems = [
  {
    id: "ss-hoodie",
    name: "SAND SOUND 로고 후디",
    price: 159000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ss-tshirt",
    name: "SAND SOUND 그래픽 티셔츠",
    price: 89000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ss-shorts",
    name: "SAND SOUND 릴랙스 쇼츠",
    price: 99000,
    img: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ss-cap",
    name: "SAND SOUND 코튼 캡",
    price: 59000,
    img: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandSandSound() {
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
    <div className="brand-ss">
      {/* HERO */}
      <section className="ss-hero with-image">
        <div
          className="ss-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ss-hero-overlay" />
        <div className="ss-hero-inner">
          <div className="ss-hero-badge">SAND SOUND</div>
          <h1 className="ss-hero-title">서핑 & 비치 라이프스타일, SAND SOUND</h1>
          <p className="ss-hero-desc">
            파도와 모래, 음악에서 영감을 받은 샌드사운드. 편안한 실루엣과
            비치 무드가 살아있는 컬렉션을 만나보세요.
          </p>

          <div className="ss-hero-cta">
            <Link to="/category?brand=sandsound" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#ss-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="ss-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>BEACH</strong>
              <span>라이프스타일</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="ss-section">
        <div className="ss-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=sandsound" className="link-more">
            더보기
          </Link>
        </div>

        <div className="ss-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="ss-card" key={p.id}>
                <div className="ss-thumb">
                  {p.badges?.length ? (
                    <div className="ss-badges">
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

                <div className="ss-meta">
                  <div className="ss-name">{p.name}</div>
                  <div className="ss-price">{fmt(p.price)}</div>

                  <div className="ss-actions">
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
      <section id="ss-benefits" className="ss-benefit">
        <div className="inner">
          <div className="signup-card ss-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>SAND SOUND 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 후디·티셔츠 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">비치 라이프</div>
              <p>바다와 서핑에서 영감 받은 디자인.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">소프트 원단</div>
              <p>기분 좋은 터치감의 코튼/테리 소재.</p>
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
      <section className="ss-section">
        <div className="ss-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="ss-lookbook">
          {lookbook.map((src, i) => (
            <div className="ss-card-img" key={i}>
              <img src={srcOf(src)} alt={`sandsound-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
