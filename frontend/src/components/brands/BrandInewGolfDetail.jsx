// frontend/src/components/brands/BrandInewGolfDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandinewgolf.css";
import { buyNow } from "../../utils/buynow";

/* 유틸 */
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

/** INYOU GOLF 샘플 상품 */
const hotItems = [
  {
    id: "ig-polo",
    name: "INYOU GOLF 테크 폴로",
    price: 129000,
    img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ig-wind",
    name: "INYOU GOLF 윈드브레이커",
    price: 219000,
    img: "https://images.unsplash.com/photo-1519683222233-3b1817f69a2a?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ig-shoes",
    name: "INYOU GOLF 스파이크리스",
    price: 179000,
    img: "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ig-cap",
    name: "INYOU GOLF 메쉬 캡",
    price: 49000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1560439513-74b1e5650b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519996529931-28324d5a6301?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandInewGolfDetail() {
  const navigate = useNavigate();

  // 합계(그냥 화면용)
  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 id
  const [picked, setPicked] = useState({}); // { sku: "M" }

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
    <div className="brand-ig">
      {/* HERO */}
      <section className="ig-hero with-image">
        <div
          className="ig-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ig-hero-overlay" />
        <div className="ig-hero-inner">
          <div className="ig-hero-badge">INYOU GOLF</div>
          <h1 className="ig-hero-title">그린 위의 퍼포먼스, INYOU GOLF</h1>
          <p className="ig-hero-desc">
            라운드의 순간마다 편안함과 스윙 밸런스를 고려한 퍼포먼스 골프
            웨어. INYOU GOLF 컬렉션으로 필드와 일상을 모두 잡아보세요.
          </p>

          <div className="ig-hero-cta">
            <Link
              to="/category?brand=inewgolf"
              className="btn primary hero-btn"
            >
              전체 상품 보기
            </Link>
            <a href="#ig-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="ig-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>S/S</strong>
              <span>이벤트 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="ig-section">
        <div className="ig-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=inewgolf" className="link-more">
            더보기
          </Link>
        </div>

        <div className="ig-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="ig-card" key={p.id}>
                <div className="ig-thumb">
                  {p.badges?.length ? (
                    <div className="ig-badges">
                      {p.badges.map((b) => (
                        <span key={b} className={`bdg ${b.toLowerCase()}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <img
                    src={srcOf(p.img)}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                    alt={p.name}
                  />
                </div>

                <div className="ig-meta">
                  <div className="ig-name">{p.name}</div>
                  <div className="ig-price">{fmt(toNum(p.price))}</div>

                  <div className="ig-actions">
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

                  {/* 사이즈 선택 박스 */}
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
      <section id="ig-benefits" className="ig-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
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
              <div className="tit">필드 예약 혜택</div>
              <p>지정 골프장 제휴 시 그린피 우대 (일부 시즌 제외)</p>
            </div>
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료 (정책 준수)</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="ig-section">
        <div className="ig-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="ig-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                alt={`look-${i}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
