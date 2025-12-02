// frontend/src/components/brands/BrandTommyHilfigerDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandtommyhilfiger.css";
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

/* TOMMY HILFIGER 샘플 상품 */
const hotItems = [
  {
    id: "th-jacket",
    name: "TOMMY HILFIGER 컬러블록 재킷",
    price: 219000,
    img: "https://images.unsplash.com/photo-1500614922032-b4f8453a8f52?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "th-sweater",
    name: "TOMMY HILFIGER 플래그 니트",
    price: 159000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "th-polo",
    name: "TOMMY HILFIGER 코튼 폴로셔츠",
    price: 89000,
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "th-cap",
    name: "TOMMY HILFIGER 플래그 캡",
    price: 49000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
];

/* LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517940310602-26535839fe1d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498550744921-75f79806b8a7?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandTommyHilfigerDetail() {
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
    <div className="brand-th">
      {/* HERO */}
      <section className="th-hero with-image">
        <div
          className="th-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="th-hero-overlay" />
        <div className="th-hero-inner">
          <div className="th-hero-badge">TOMMY HILFIGER</div>
          <h1 className="th-hero-title">아메리칸 클래식, TOMMY HILFIGER</h1>
          <p className="th-hero-desc">
            레드, 화이트, 네이비의 시그니처 플래그 컬러. 경쾌한 스트리트 무드와
            클래식한 실루엣이 만나는 타미 힐피거 컬렉션.
          </p>

          <div className="th-hero-cta">
            <Link to="/category?brand=tommyhilfiger" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#th-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="th-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>FLAG</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="th-section">
        <div className="th-head">
          <h2>지금 주목받는 아이템</h2>
          <Link to="/category?brand=tommyhilfiger" className="link-more">
            더보기
          </Link>
        </div>

        <div className="th-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="th-card" key={p.id}>
                <div className="th-thumb">
                  {p.badges?.length ? (
                    <div className="th-badges">
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

                <div className="th-meta">
                  <div className="th-name">{p.name}</div>
                  <div className="th-price">{fmt(p.price)}</div>

                  <div className="th-actions">
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
      <section id="th-benefits" className="th-benefit">
        <div className="inner">
          <div className="signup-card th-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>TOMMY HILFIGER 첫 구매 ₩10,000 쿠폰</h3>
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
              <div className="tit">플래그 컬러 포인트</div>
              <p>레드·화이트·네이비가 만들어내는 아이코닉 무드.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">데님 & 캐주얼</div>
              <p>어디에나 어울리는 데일리 캐주얼 아이템.</p>
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
      <section className="th-section">
        <div className="th-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="th-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`tommy-look-${i}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
