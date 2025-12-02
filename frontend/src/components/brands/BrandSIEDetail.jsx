// frontend/src/components/brands/BrandSIEDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandsie.css";
import { buyNow } from "../../utils/buynow";

/** 외부/내부 이미지 경로 안전 보정 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/** 샘플 상품(SIE 느낌) – 필요하면 나중에 실제 데이터로 교체 */
const sampleProducts = [
  {
    id: "sie_001",
    name: "SIE 테일러드 울 자켓",
    price: 329000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "sie_002",
    name: "SIE 슬림핏 수트 팬츠",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "sie_003",
    name: "SIE 옥스포드 셔츠",
    price: 119000,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "sie_004",
    name: "SIE 클래식 더비 슈즈",
    price: 259000,
    image:
      "https://images.unsplash.com/photo-1528701800489-20be3c30c1d5?w=900&q=80&auto=format&fit=crop",
    tag: "F/W",
  },
];

/** LOOKBOOK 이미지 */
const lookbook = [
  "https://images.unsplash.com/photo-1490111718993-d98654ce6cf7?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514996937319-344454492b37?w=1600&q=80&auto=format&fit=crop",
];

// 공통 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandSIEDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => sampleProducts.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 카드별 사이즈 선택 상태 (Beaker / Beanpole와 동일 패턴)
  const [openSku, setOpenSku] = useState(null); // 열려 있는 상품 id
  const [pickedSize, setPickedSize] = useState({}); // { [sku]: "M" }

  const openPicker = (sku) => {
    setOpenSku((prev) => (prev === sku ? null : sku));
  };

  const onPickSize = (sku, size) => {
    setPickedSize((prev) => ({ ...prev, [sku]: size }));
  };

  const onBuy = (p) => {
    const size = pickedSize[p.id];
    if (!size) return;

    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.image },
      1,
      navigate,
      { size }
    );
  };

  return (
    <div className="brand-sie">
      {/* HERO */}
      <section className="brandsie-hero">
        <div className="brandsie-hero-inner">
          <div className="brandsie-badge">SIE</div>
          <h1 className="brandsie-title">
            모던 테일러링의 기준, <span>SIE</span>
          </h1>
          <p className="brandsie-sub">
            도시적인 실루엣과 미니멀한 디테일. SIE의 수트 컬렉션으로
            데일리·비즈니스 룩을 완성해보세요.
          </p>

          <div className="brandsie-cta">
            <Link
              to="/category?brand=sie"
              className="brandsie-btn brandsie-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#sie-benefits" className="brandsie-btn brandsie-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandsie-stats">
            <li>
              <strong>{sampleProducts.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(total / 1000).toLocaleString()}K</strong>
              <span>합계 가격(참고)</span>
            </li>
            <li>
              <strong>F/W</strong>
              <span>이번 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 추천 상품 */}
      <section className="brandsie-section">
        <div className="brandsie-section-head">
          <h2>지금 핫한 SIE 아이템</h2>
          <Link to="/category?brand=sie" className="brandsie-more">
            더 보기
          </Link>
        </div>

        <div className="brandsie-grid">
          {sampleProducts.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandsie-card">
                <div className="brandsie-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandsie-tag">{p.tag}</span>}
                </div>

                <div className="brandsie-card-body">
                  <h3 className="brandsie-name">{p.name}</h3>
                  <div className="brandsie-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandsie-actions">
                    <Link
                      to={`/product/${p.id}`}
                      className="brandsie-small-btn"
                    >
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandsie-small-btn brandsie-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 (Beaker/Beanpole 구조 그대로) */}
                  {opened && (
                    <div className="brandsie-sizebox">
                      <div className="sizebox-title">사이즈 선택</div>

                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`sizebox-chip ${
                              curSize === s ? "active" : ""
                            }`}
                            onClick={() => onPickSize(p.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="sizebox-actions">
                        <button
                          type="button"
                          className="brandsie-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandsie-small-btn brandsie-small-primary ${
                            !curSize ? "disabled" : ""
                          }`}
                          onClick={() => onBuy(p)}
                          disabled={!curSize}
                        >
                          구매 진행
                        </button>
                      </div>

                      {!curSize && (
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

      {/* 혜택/쿠폰 */}
      <section id="sie-benefits" className="brandsie-benefits">
        <div className="brandsie-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>SIE 전용 신규 가입 쿠폰으로 수트 라인을 합리적으로 만나보세요.</p>
          </div>
          <div className="benefit-right">
            <Link
              to="/signup"
              className="brandsie-btn brandsie-btn-primary brandsie-benefit-btn"
            >
              회원가입
            </Link>
            <Link
              to="/mypage/coupons"
              className="brandsie-btn brandsie-btn-ghost brandsie-benefit-btn"
            >
              자세히 보기
            </Link>
          </div>
        </div>

        <div className="brandsie-benefit-sub">
          <div>
            <strong>멤버십 등급 추가적립</strong>
            <span>구매 금액대별 최대 5% 포인트 적립</span>
          </div>
          <div>
            <strong>오늘 출발</strong>
            <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
          </div>
          <div>
            <strong>무료 수선</strong>
            <span>수트 기장/허리 수선 1회 무료(정책 기준 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandsie-section">
        <div className="brandsie-section-head">
          <h2>LOOKBOOK</h2>
        </div>

        <div className="brandsie-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandsie-section">
        <div className="brandsie-section-head">
          <h2>SIE 오프라인</h2>
        </div>
        <div className="brandsie-store">
          <div className="store-text">
            <h3>SIE 플래그십 스토어</h3>
            <p>수트 피팅과 스타일링 상담을 오프라인 매장에서 경험해보세요.</p>
            <a
              className="brandsie-btn brandsie-btn-ghost"
              href="https://map.naver.com/"
              target="_blank"
              rel="noreferrer"
            >
              길찾기
            </a>
          </div>
          <div className="store-map">
            <img
              src={srcOf(
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
