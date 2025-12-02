// frontend/src/components/brands/BrandCosDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandcos.css";
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

/* COS 샘플 상품 */
const hotItems = [
  {
    id: "cos-coat",
    name: "COS 오버핏 울 코트",
    price: 279000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "cos-knit",
    name: "COS 크루넥 니트 스웨터",
    price: 129000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "cos-shirt",
    name: "COS 릴랙스드 셔츠",
    price: 89000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "cos-trouser",
    name: "COS 테이퍼드 팬츠",
    price: 119000,
    img: "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandCosDetail() {
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
    <div className="brand-cos">
      {/* HERO */}
      <section className="cos-hero with-image">
        <div
          className="cos-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="cos-hero-overlay" />
        <div className="cos-hero-inner">
          <div className="cos-hero-badge">COS</div>
          <h1 className="cos-hero-title">미니멀 실루엣의 정석, COS</h1>
          <p className="cos-hero-desc">
            군더더기 없는 라인과 차분한 컬러 팔레트. COS와 함께 완성하는
            모던 데일리 룩.
          </p>

          <div className="cos-hero-cta">
            <Link to="/category?brand=cos" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#cos-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="cos-stats">
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
      <section className="cos-section">
        <div className="cos-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=cos" className="link-more">
            더보기
          </Link>
        </div>

        <div className="cos-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="cos-card" key={p.id}>
                <div className="cos-thumb">
                  {p.badges?.length ? (
                    <div className="cos-badges">
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

                <div className="cos-meta">
                  <div className="cos-name">{p.name}</div>
                  <div className="cos-price">{fmt(p.price)}</div>

                  <div className="cos-actions">
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
      <section id="cos-benefits" className="cos-benefit">
        <div className="inner">
          <div className="signup-card cos-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>COS 첫 구매 ₩10,000 쿠폰</h3>
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
              <div className="tit">미니멀 실루엣</div>
              <p>유행을 타지 않는 기본에 충실한 디자인.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">고급 소재</div>
              <p>울, 캐시미어 등 고급 원단 사용.</p>
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
      <section className="cos-section">
        <div className="cos-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="cos-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`cos-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
