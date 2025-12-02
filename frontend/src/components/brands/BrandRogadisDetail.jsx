import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandrogadis.css";
import { buyNow } from "../../utils/buynow";

/* 유틸 */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL}/${s.replace(/^\/+/, "")}`;
};

const SIZES = ["90", "95", "100", "105", "110"];

/* 샘플 상품 */
const hotItems = [
  {
    id: "rgds-suit",
    name: "ROGADIS 모던핏 수트",
    price: 398000,
    img: "https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "rgds-jacket",
    name: "ROGADIS 스트레치 자켓",
    price: 329000,
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "rgds-shirt",
    name: "ROGADIS 논아이론 셔츠",
    price: 89000,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "rgds-shoes",
    name: "ROGADIS 블랙 더비 슈즈",
    price: 249000,
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandRogadisDetail() {
  const navigate = useNavigate();

  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null);
  const [picked, setPicked] = useState({});

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
    <div className="brand-rgds">
      {/* HERO */}
      <section className="rgds-hero with-image">
        <div
          className="rgds-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="rgds-hero-overlay" />
        <div className="rgds-hero-inner">
          <div className="rgds-hero-badge">ROGADIS</div>
          <h1 className="rgds-hero-title">
            세련된 실루엣의 뉴 클래식, ROGADIS
          </h1>
          <p className="rgds-hero-desc">
            비즈니스와 라이프스타일의 경계를 허무는 하이브리드 패션.
            ROGADIS만의 품격을 경험하세요.
          </p>

          <div className="rgds-hero-cta">
            <Link to="/category?brand=rogadis" className="btn primary hero-btn">
              전체 상품 보기
            </Link>
            <a href="#rgds-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="rgds-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>총합(예시)</span>
            </li>
            <li>
              <strong>CLASSIC</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="rgds-section">
        <div className="rgds-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=rogadis" className="link-more">
            더보기
          </Link>
        </div>

        <div className="rgds-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="rgds-card" key={p.id}>
                <div className="rgds-thumb">
                  {p.badges?.length ? (
                    <div className="rgds-badges">
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

                <div className="rgds-meta">
                  <div className="rgds-name">{p.name}</div>
                  <div className="rgds-price">{fmt(toNum(p.price))}</div>

                  <div className="rgds-actions">
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
      <section id="rgds-benefits" className="rgds-benefit">
        <div className="inner">
          <div className="signup-card rgds-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>ROGADIS 첫 구매 ₩10,000 할인 쿠폰</h3>
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
              <div className="tit">수트 & 셋업라인</div>
              <p>비즈니스 캐주얼을 위한 정제된 실루엣.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">논아이론 셔츠</div>
              <p>관리 편하고 하루 종일 깔끔한 착용감.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘출발</div>
              <p>오후 2시 이전 결제 시 당일 발송.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 교환/반품</div>
              <p>사이즈 교환 1회 무료.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="rgds-section">
        <div className="rgds-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="rgds-lookbook">
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
