// frontend/src/components/brands/BrandCanadaGooseDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandcanadagoose.css";
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

/* CANADA GOOSE 샘플 상품 */
const hotItems = [
  {
    id: "cg-expedition",
    name: "CANADA GOOSE 익스페디션 파카",
    price: 1590000,
    img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "cg-chilliwack",
    name: "CANADA GOOSE 칠리왁 봄버",
    price: 1390000,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "cg-freestyle",
    name: "CANADA GOOSE 프리스타일 조끼",
    price: 890000,
    img: "https://images.unsplash.com/photo-1544022613-8e482d4a5c1b?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "cg-beanie",
    name: "CANADA GOOSE 로고 비니",
    price: 189000,
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519681392199-1bffb3a3e50b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516594915697-87eb3b1c7f4c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511746315387-c4a76990fd01?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandCanadaGooseDetail() {
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
    <div className="brand-cg">
      {/* HERO */}
      <section className="cg-hero with-image">
        <div
          className="cg-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519681396912-46ec25e207f3?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="cg-hero-overlay" />
        <div className="cg-hero-inner">
          <div className="cg-hero-badge">CANADA GOOSE</div>
          <h1 className="cg-hero-title">극한의 추위를 이기는, CANADA GOOSE</h1>
          <p className="cg-hero-desc">
            북극 탐험대가 선택한 다운 파카. 타협 없는 보온성과 아이코닉한
            로고 패치로 완성되는 윈터 아우터 스타일.
          </p>

          <div className="cg-hero-cta">
            <Link to="/category?brand=canadagoose" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#cg-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="cg-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>ARCTIC</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="cg-section">
        <div className="cg-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=canadagoose" className="link-more">
            더보기
          </Link>
        </div>

        <div className="cg-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="cg-card" key={p.id}>
                <div className="cg-thumb">
                  {p.badges?.length ? (
                    <div className="cg-badges">
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

                <div className="cg-meta">
                  <div className="cg-name">{p.name}</div>
                  <div className="cg-price">{fmt(p.price)}</div>

                  <div className="cg-actions">
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
      <section id="cg-benefits" className="cg-benefit">
        <div className="inner">
          <div className="signup-card cg-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>CANADA GOOSE 첫 구매 ₩50,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 윈터 아우터 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">극강의 보온성</div>
              <p>북극 탐험대도 사용하는 다운 충전량과 설계.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">프리미엄 소재</div>
              <p>코요테 퍼 트림, 고밀도 원단으로 완성된 내구성.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.(일부 품목 제외)</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="cg-section">
        <div className="cg-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="cg-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`canadagoose-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
