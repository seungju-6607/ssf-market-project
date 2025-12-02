// frontend/src/components/brands/BrandJuunJDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandjuunj.css";
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

/** juun.j 샘플 상품 */
const hotItems = [
  {
    id: "jj-coat",
    name: "juun.j 오버사이즈 롱 코트",
    price: 1299000,
    img: "https://images.unsplash.com/photo-1513097847644-f00cfe868607?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "jj-leather",
    name: "juun.j 레더 라이더 자켓",
    price: 1599000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "jj-sweat",
    name: "juun.j 오버핏 스웨트셔츠",
    price: 459000,
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "jj-pants",
    name: "juun.j 와이드 조거 팬츠",
    price: 389000,
    img: "https://images.unsplash.com/photo-1537123545669-54087c79997e?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1513097847644-f00cfe868607?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandJuunJDetail() {
  const navigate = useNavigate();

  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열려 있는 상품 id
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
    <div className="brand-jj">
      {/* HERO */}
      <section className="jj-hero with-image">
        <div
          className="jj-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="jj-hero-overlay" />
        <div className="jj-hero-inner">
          <div className="jj-hero-badge">juun.j</div>
          <h1 className="jj-hero-title">
            구조적인 실루엣의 모던 스트리트, juun.j
          </h1>
          <p className="jj-hero-desc">
            오버사이즈 실루엣과 모노톤 컬러 팔레트로 완성되는 하이엔드 스트리트
            룩. juun.j 컬렉션으로 존재감을 더해보세요.
          </p>

          <div className="jj-hero-cta">
            <Link to="/category?brand=juunj" className="btn primary hero-btn">
              전체 상품 보기
            </Link>
            <a href="#jj-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="jj-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000000).toFixed(1)}M</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>FW</strong>
              <span>런웨이 라인업</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="jj-section">
        <div className="jj-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=juunj" className="link-more">
            더보기
          </Link>
        </div>

        <div className="jj-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="jj-card" key={p.id}>
                <div className="jj-thumb">
                  {p.badges?.length ? (
                    <div className="jj-badges">
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

                <div className="jj-meta">
                  <div className="jj-name">{p.name}</div>
                  <div className="jj-price">{fmt(toNum(p.price))}</div>

                  <div className="jj-actions">
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
      <section id="jj-benefits" className="jj-benefit">
        <div className="inner">
          <div className="signup-card jj-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>juun.j 전용 첫 구매 10,000원 쿠폰</h3>
              <p>
                회원가입만 해도 juun.j 컬렉션에 바로 사용할 수 있는 웰컴 쿠폰을
                드립니다.
              </p>
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
              <div className="tit">런웨이 캡슐 컬렉션</div>
              <p>시즌별 쇼피스 캡슐을 한정 수량으로 선보입니다.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목 제외).</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="jj-section">
        <div className="jj-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="jj-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                alt={`look-${i}`}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
