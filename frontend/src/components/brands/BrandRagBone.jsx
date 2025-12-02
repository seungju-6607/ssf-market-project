// frontend/src/components/brands/BrandRagBone.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BrandRagBone.css";
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

/* RAG & BONE 샘플 상품 */
const hotItems = [
  {
    id: "rb-denim-slim",
    name: "RAG & BONE 슬림핏 데님",
    price: 389000,
    img: "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "rb-denim-relax",
    name: "RAG & BONE 릴랙스 스트레이트 데님",
    price: 409000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "rb-leather-jacket",
    name: "RAG & BONE 레더 재킷",
    price: 890000,
    img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "rb-tee",
    name: "RAG & BONE 에센셜 티셔츠",
    price: 159000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512412046876-f386342eddb3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandRagBone() {
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
    <div className="brand-rg">
      {/* HERO */}
      <section className="rg-hero with-image">
        <div
          className="rg-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="rg-hero-overlay" />
        <div className="rg-hero-inner">
          <div className="rg-hero-badge">RAG &amp; BONE</div>
          <h1 className="rg-hero-title">뉴욕 스트리트 감성, RAG &amp; BONE</h1>
          <p className="rg-hero-desc">
            클래식 데님과 미니멀한 실루엣이 만난 랙앤본. 도시적인 무드를
            완성해 줄 키 아이템을 지금 만나보세요.
          </p>

          <div className="rg-hero-cta">
            <Link to="/category?brand=ragbone" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#rg-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="rg-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>DENIM</strong>
              <span>시그니처</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="rg-section">
        <div className="rg-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=ragbone" className="link-more">
            더보기
          </Link>
        </div>

        <div className="rg-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="rg-card" key={p.id}>
                <div className="rg-thumb">
                  {p.badges?.length ? (
                    <div className="rg-badges">
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

                <div className="rg-meta">
                  <div className="rg-name">{p.name}</div>
                  <div className="rg-price">{fmt(p.price)}</div>

                  <div className="rg-actions">
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
      <section id="rg-benefits" className="rg-benefit">
        <div className="inner">
          <div className="signup-card rg-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>RAG &amp; BONE 첫 구매 ₩20,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 데님·재킷 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">뉴욕 기반 브랜드</div>
              <p>스트리트와 테일러링이 섞인 감도 높은 실루엣.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">프리미엄 데님</div>
              <p>탄탄한 원단과 자연스러운 워싱.</p>
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
      <section className="rg-section">
        <div className="rg-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="rg-lookbook">
          {lookbook.map((src, i) => (
            <div className="rg-card-img" key={i}>
              <img src={srcOf(src)} alt={`ragbone-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
