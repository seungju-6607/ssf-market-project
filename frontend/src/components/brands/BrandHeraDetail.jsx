// frontend/src/components/brands/BrandHeraDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandhera.css";
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

/* 헤라라서 사이즈 대신 호수/컬러 느낌으로 */
const OPTIONS = ["17N", "21N", "23N", "25N"];

/* HERA 샘플 상품 */
const hotItems = [
  {
    id: "hera-blackcushion",
    name: "HERA 블랙 쿠션 SPF 50+ PA+++",
    price: 63000,
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "hera-sensuallip",
    name: "HERA 센슈얼 파우더 매트 립",
    price: 39000,
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "hera-eyepalette",
    name: "HERA 아이섀도우 팔레트",
    price: 69000,
    img: "https://images.unsplash.com/photo-1612810432637-96f64dc8ccb6?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "hera-perfume",
    name: "HERA 시그니처 퍼퓸",
    price: 99000,
    img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542838132-0fae305532e7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519414442781-fbd745c5b497?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandHeraDetail() {
  const navigate = useNavigate();
  const [openSku, setOpenSku] = useState(null);
  const [picked, setPicked] = useState({});

  const sum = useMemo(
    () => hotItems.reduce((acc, cur) => acc + toNum(cur.price), 0),
    []
  );

  const openPicker = (sku) => setOpenSku((v) => (v === sku ? null : sku));
  const onPick = (sku, opt) => setPicked((p) => ({ ...p, [sku]: opt }));

  const onBuy = (p) => {
    const option = picked[p.id];
    if (!option) return;
    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.img },
      1,
      navigate,
      { option }
    );
  };

  return (
    <div className="brand-hera">
      {/* HERO */}
      <section className="hera-hero with-image">
        <div
          className="hera-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="hera-hero-overlay" />
        <div className="hera-hero-inner">
          <div className="hera-hero-badge">HERA</div>
          <h1 className="hera-hero-title">서울 시그니처 뷰티, HERA</h1>
          <p className="hera-hero-desc">
            감각적인 컬러와 세련된 텍스처. 도시의 빛을 닮은 헤라의 메이크업
            컬렉션을 만나보세요.
          </p>

          <div className="hera-hero-cta">
            <Link to="/category?brand=hera" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#hera-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="hera-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>SEOULISTA</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="hera-section">
        <div className="hera-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=hera" className="link-more">
            더보기
          </Link>
        </div>

        <div className="hera-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const opt = picked[p.id] || "";

            return (
              <article className="hera-card" key={p.id}>
                <div className="hera-thumb">
                  {p.badges?.length ? (
                    <div className="hera-badges">
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

                <div className="hera-meta">
                  <div className="hera-name">{p.name}</div>
                  <div className="hera-price">{fmt(p.price)}</div>

                  <div className="hera-actions">
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
                      <div className="sizebox-title">옵션 선택</div>
                      <div className="sizebox-chips">
                        {OPTIONS.map((o) => (
                          <button
                            key={o}
                            type="button"
                            className={`sizebox-chip ${
                              opt === o ? "active" : ""
                            }`}
                            onClick={() => onPick(p.id, o)}
                          >
                            {o}
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
                          disabled={!opt}
                          onClick={() => onBuy(p)}
                        >
                          구매 진행
                        </button>
                      </div>
                      {!opt && (
                        <div className="sizebox-warn">
                          옵션을 선택해주세요
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
      <section id="hera-benefits" className="hera-benefit">
        <div className="inner">
          <div className="signup-card hera-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>HERA 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 메이크업 전용 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <Link to="/signup" className="btn primary">
                회원가입
              </Link>
              <Link to="mypage/coupons" className="btn ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="benefit-card">
              <div className="tit">고발색 텍스처</div>
              <p>한 번의 터치로도 선명하게 표현되는 컬러.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">롱래스팅 포뮬라</div>
              <p>도시 라이프에도 무너지지 않는 지속력.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>단순 변심 제외, 일부 품목 1회 무료 반품.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="hera-section">
        <div className="hera-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="hera-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`hera-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
