// frontend/src/components/brands/BrandGeneralIdeaDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandgeneralidea.css";
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

/** GENERAL IDEA 샘플 상품 */
const hotItems = [
  {
    id: "gi-sweat",
    name: "GENERAL IDEA 로고 스웨트셔츠",
    price: 139000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "gi-jacket",
    name: "GENERAL IDEA 하프 집업 재킷",
    price: 189000,
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "gi-pants",
    name: "GENERAL IDEA 와이드 팬츠",
    price: 159000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "gi-cap",
    name: "GENERAL IDEA 볼캡",
    price: 49000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500614922032-b4f8453a8f52?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandGeneralIdeaDetail() {
  const navigate = useNavigate();

  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 ID
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
    <div className="brand-gi">
      {/* HERO */}
      <section className="gi-hero with-image">
        <div
          className="gi-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="gi-hero-overlay" />
        <div className="gi-hero-inner">
          <div className="gi-hero-badge">GENERAL IDEA</div>
          <h1 className="gi-hero-title">
            스트리트 무드를 담은 모던 캐주얼, GENERAL IDEA
          </h1>
          <p className="gi-hero-desc">
            미니멀한 실루엣과 감각적인 그래픽 디테일. GENERAL IDEA 컬렉션으로
            데일리 룩에 스트리트 무드를 더해보세요.
          </p>

          <div className="gi-hero-cta">
            <Link
              to="/category?brand=generalidea"
              className="btn primary hero-btn"
            >
              전체 상품 보기
            </Link>
            <a href="#gi-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="gi-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>F/W</strong>
              <span>시즌 키 라인업</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="gi-section">
        <div className="gi-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=generalidea" className="link-more">
            더보기
          </Link>
        </div>

        <div className="gi-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="gi-card" key={p.id}>
                <div className="gi-thumb">
                  {p.badges?.length ? (
                    <div className="gi-badges">
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

                <div className="gi-meta">
                  <div className="gi-name">{p.name}</div>
                  <div className="gi-price">{fmt(toNum(p.price))}</div>

                  <div className="gi-actions">
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
      <section id="gi-benefits" className="gi-benefit">
        <div className="inner">
          <div className="signup-card gi-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>GENERAL IDEA 전용 첫 구매 10,000원 쿠폰</h3>
              <p>
                회원가입만 해도 GENERAL IDEA 컬렉션에 즉시 사용 가능한 웰컴
                쿠폰을 드립니다.
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
              <div className="tit">시즌오프 알림</div>
              <p>시즌오프 및 한정 발매 소식을 가장 먼저 받아보세요.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립 혜택.</p>
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
      <section className="gi-section">
        <div className="gi-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="gi-lookbook">
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
