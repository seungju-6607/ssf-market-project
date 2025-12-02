// frontend/src/components/brands/BrandToryBurchDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandtoryburch.css";
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

/* TORY BURCH 샘플 상품 */
const hotItems = [
  {
    id: "tb-fleming-bag",
    name: "TORY BURCH 플레밍 숄더백",
    price: 689000,
    img: "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "tb-miller-sandal",
    name: "TORY BURCH 밀러 샌들",
    price: 329000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "tb-dress",
    name: "TORY BURCH 플로럴 원피스",
    price: 459000,
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "tb-card-holder",
    name: "TORY BURCH 로고 카드 지갑",
    price: 189000,
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandToryBurchDetail() {
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
    <div className="brand-tb">
      {/* HERO */}
      <section className="tb-hero with-image">
        <div
          className="tb-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="tb-hero-overlay" />
        <div className="tb-hero-inner">
          <div className="tb-hero-badge">TORY BURCH</div>
          <h1 className="tb-hero-title">보헤미안 럭셔리, TORY BURCH</h1>
          <p className="tb-hero-desc">
            아이코닉한 더블-T 로고와 감각적인 프린트. 데일리와 휴양지 어디서나
            빛나는 토리버치 컬렉션을 만나보세요.
          </p>

          <div className="tb-hero-cta">
            <Link to="/category?brand=toryburch" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#tb-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="tb-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>RESORT</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="tb-section">
        <div className="tb-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=toryburch" className="link-more">
            더보기
          </Link>
        </div>

        <div className="tb-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="tb-card" key={p.id}>
                <div className="tb-thumb">
                  {p.badges?.length ? (
                    <div className="tb-badges">
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

                <div className="tb-meta">
                  <div className="tb-name">{p.name}</div>
                  <div className="tb-price">{fmt(p.price)}</div>

                  <div className="tb-actions">
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
      <section id="tb-benefits" className="tb-benefit">
        <div className="inner">
          <div className="signup-card tb-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>TORY BURCH 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 핸드백·슈즈 전용 쿠폰을 드립니다.</p>
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
              <div className="tit">아이코닉 로고</div>
              <p>더블-T 로고가 돋보이는 시그니처 디자인.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">편안한 착화감</div>
              <p>밀러 샌들, 플랫 등 데일리 슈즈 라인.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="tb-section">
        <div className="tb-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="tb-lookbook">
          {lookbook.map((src, i) => (
            <div className="tb-card-img" key={i}>
              <img src={srcOf(src)} alt={`toryburch-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
