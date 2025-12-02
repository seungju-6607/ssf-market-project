// frontend/src/components/brands/BrandDantonDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./branddanton.css";
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

/** DANTON 샘플 상품 */
const hotItems = [
  {
    id: "dt-down",
    name: "DANTON 라운드 카라 다운 재킷",
    price: 329000,
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "dt-fleece",
    name: "DANTON 플리스 자켓",
    price: 189000,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "dt-shirt",
    name: "DANTON 로고 포켓 티셔츠",
    price: 69000,
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "dt-bag",
    name: "DANTON 캔버스 토트백",
    price: 89000,
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandDantonDetail() {
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
    <div className="brand-dt">
      {/* HERO */}
      <section className="dt-hero with-image">
        <div
          className="dt-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1521193086137-5af6a4c00f15?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="dt-hero-overlay" />
        <div className="dt-hero-inner">
          <div className="dt-hero-badge">DANTON</div>
          <h1 className="dt-hero-title">
            프렌치 워크웨어의 정석, DANTON
          </h1>
          <p className="dt-hero-desc">
            빈티지 워크웨어에서 영감을 받은 실루엣과 실용적인 디테일.
            DANTON으로 일상 속 캐주얼룩을 완성해보세요.
          </p>

          <div className="dt-hero-cta">
            <Link to="/category?brand=danton" className="btn primary hero-btn">
              전체 상품 보기
            </Link>
            <a href="#dt-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="dt-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>WORK</strong>
              <span>웨어 라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="dt-section">
        <div className="dt-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=danton" className="link-more">
            더보기
          </Link>
        </div>

        <div className="dt-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="dt-card" key={p.id}>
                <div className="dt-thumb">
                  {p.badges?.length ? (
                    <div className="dt-badges">
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

                <div className="dt-meta">
                  <div className="dt-name">{p.name}</div>
                  <div className="dt-price">{fmt(toNum(p.price))}</div>

                  <div className="dt-actions">
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
      <section id="dt-benefits" className="dt-benefit">
        <div className="inner">
          <div className="signup-card dt-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>DANTON 첫 구매 10,000원 쿠폰</h3>
              <p>
                회원가입만 해도 DANTON 컬렉션에 즉시 사용 가능한 웰컴 쿠폰을
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
              <div className="tit">데일리 아우터</div>
              <p>간절기·겨울까지 활용 가능한 베스트셀러 아우터.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">탄탄한 소재</div>
              <p>워크웨어 감성의 내구성 좋은 원단 사용.</p>
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
      <section className="dt-section">
        <div className="dt-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="dt-lookbook">
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
