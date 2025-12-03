// frontend/src/components/brands/BrandApertureDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandaperture.css";
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

/* 디애퍼처 샘플 상품 */
const hotItems = [
  {
    id: "apt-camera-bag",
    name: "APERTURE 카메라 크로스백",
    price: 159000,
    img: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "apt-hoodie",
    name: "APERTURE 로고 후디",
    price: 119000,
    img: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "apt-cap",
    name: "APERTURE 스냅백 캡",
    price: 49000,
    img: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "apt-strap",
    name: "APERTURE 카메라 스트랩",
    price: 39000,
    img: "https://images.unsplash.com/photo-1542973748-658653fb3d52?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK 이미지 */
const lookbook = [
  "https://images.unsplash.com/photo-1516031190212-da133013de50?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516838083508-74697beabab4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516727003284-a96541e51e9c?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandApertureDetail() {
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
    <div className="brand-apt">
      {/* HERO */}
      <section className="apt-hero with-image">
        <div
          className="apt-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1473280025148-643f9b0cbac5?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="apt-hero-overlay" />
        <div className="apt-hero-inner">
          <div className="apt-hero-badge">APERTURE</div>
          <h1 className="apt-hero-title">빛을 담는 라이프스타일, APERTURE</h1>
          <p className="apt-hero-desc">
            카메라에서 영감을 받은 그래픽과 디테일. 일상 속에서 자연스럽게
            녹아드는 라이프스타일 웨어를 만나보세요.
          </p>

          <div className="apt-hero-cta">
            <Link to="/brands" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#apt-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="apt-stats">
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
      <section className="apt-section">
        <div className="apt-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=aperture" className="link-more">
            더보기
          </Link>
        </div>

        <div className="apt-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";
            return (
              <article className="apt-card" key={p.id}>
                <div className="apt-thumb">
                  {p.badges?.length ? (
                    <div className="apt-badges">
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

                <div className="apt-meta">
                  <div className="apt-name">{p.name}</div>
                  <div className="apt-price">{fmt(p.price)}</div>

                  <div className="apt-actions">
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
      <section id="apt-benefits" className="apt-benefit">
        <div className="inner">
          <div className="signup-card apt-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>APERTURE 첫 구매 ₩10,000 쿠폰</h3>
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
              <div className="tit">포토그래퍼 무드</div>
              <p>카메라 스트랩, 캡 등 사진가 감성의 디테일.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">데일리 웨어</div>
              <p>후디, 티셔츠 등 일상에서 편하게 입는 실루엣.</p>
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
      <section className="apt-section">
        <div className="apt-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="apt-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`aperture-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
