// frontend/src/components/brands/BrandGalaxyDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandgalaxy.css";
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

/* 갤럭시 정장 사이즈 예시 */
const SIZES = ["90", "95", "100", "105", "110"];

/* GALAXY 샘플 상품 */
const hotItems = [
  {
    id: "gx-suit-classic",
    name: "GALAXY 클래식 네이비 수트",
    price: 590000,
    img: "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "gx-suit-slim",
    name: "GALAXY 슬림핏 체크 수트",
    price: 650000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "gx-coat",
    name: "GALAXY 캐시미어 블렌드 코트",
    price: 790000,
    img: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "gx-shirt",
    name: "GALAXY 논아이롱 드레스 셔츠",
    price: 129000,
    img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975698519-59c35a50207f?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandGalaxyDetail() {
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
    <div className="brand-gx">
      {/* HERO */}
      <section className="gx-hero with-image">
        <div
          className="gx-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="gx-hero-overlay" />
        <div className="gx-hero-inner">
          <div className="gx-hero-badge">GALAXY</div>
          <h1 className="gx-hero-title">비즈니스 클래식, GALAXY</h1>
          <p className="gx-hero-desc">
            정교한 테일러링과 고급 원단으로 완성한 수트 컬렉션. 중요한
            순간마다 갤럭시와 함께하세요.
          </p>

          <div className="gx-hero-cta">
            <Link to="/category?brand=galaxy" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#gx-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="gx-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>SUIT LINE</strong>
              <span>클래식</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="gx-section">
        <div className="gx-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=galaxy" className="link-more">
            더보기
          </Link>
        </div>

        <div className="gx-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="gx-card" key={p.id}>
                <div className="gx-thumb">
                  {p.badges?.length ? (
                    <div className="gx-badges">
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

                <div className="gx-meta">
                  <div className="gx-name">{p.name}</div>
                  <div className="gx-price">{fmt(p.price)}</div>

                  <div className="gx-actions">
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
      <section id="gx-benefits" className="gx-benefit">
        <div className="inner">
          <div className="signup-card gx-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>GALAXY 첫 수트 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 수트·셔츠 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">정교한 패턴</div>
              <p>한국 체형에 맞춘 테일러링 패턴.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">프리미엄 원단</div>
              <p>울·캐시미어 등 고급 원단 사용.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 수선</div>
              <p>일부 매장 수선 서비스 제공(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="gx-section">
        <div className="gx-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="gx-lookbook">
          {lookbook.map((src, i) => (
            <div className="gx-card-img" key={i}>
              <img src={srcOf(src)} alt={`galaxy-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
