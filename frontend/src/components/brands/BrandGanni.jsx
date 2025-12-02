// frontend/src/components/brands/BrandGanni.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrandGanni.css";
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

/* 가니는 보통 숫자 사이즈 (EU) */
const SIZES = ["34", "36", "38", "40"];

/* GANNI 샘플 상품 */
const hotItems = [
  {
    id: "gani-dress",
    name: "GANNI 플로럴 미니 드레스",
    price: 459000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "gani-cardigan",
    name: "GANNI 체크 가디건",
    price: 389000,
    img: "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "gani-blouse",
    name: "GANNI 러플 블라우스",
    price: 319000,
    img: "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "gani-jeans",
    name: "GANNI 스트레이트 데님",
    price: 289000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandGanni() {
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
    <div className="brand-gn">
      {/* HERO */}
      <section className="gn-hero with-image">
        <div
          className="gn-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="gn-hero-overlay" />
        <div className="gn-hero-inner">
          <div className="gn-hero-badge">GANNI</div>
          <h1 className="gn-hero-title">코펜하겐 감성, GANNI</h1>
          <p className="gn-hero-desc">
            사랑스러운 프린트와 여유로운 실루엣. 가니만의 발랄한 무드를
            담은 컬렉션을 만나보세요.
          </p>

          <div className="gn-hero-cta">
            <Link to="/category?brand=ganni" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#gn-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="gn-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>SCANDI</strong>
              <span>스타일</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="gn-section">
        <div className="gn-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=ganni" className="link-more">
            더보기
          </Link>
        </div>

        <div className="gn-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="gn-card" key={p.id}>
                <div className="gn-thumb">
                  {p.badges?.length ? (
                    <div className="gn-badges">
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

                <div className="gn-meta">
                  <div className="gn-name">{p.name}</div>
                  <div className="gn-price">{fmt(p.price)}</div>

                  <div className="gn-actions">
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
      <section id="gn-benefits" className="gn-benefit">
        <div className="inner">
          <div className="signup-card gn-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>GANNI 첫 구매 ₩20,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 드레스·니트 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">플로럴 프린트</div>
              <p>가니 특유의 사랑스러운 패턴.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">지속 가능 소재</div>
              <p>리사이클 폴리·오가닉 코튼 사용.</p>
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
      <section className="gn-section">
        <div className="gn-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="gn-lookbook">
          {lookbook.map((src, i) => (
            <div className="gn-card-img" key={i}>
              <img src={srcOf(src)} alt={`ganni-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
