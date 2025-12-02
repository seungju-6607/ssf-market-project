import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandmaisonkitsune.css"; // 이 페이지 전용 CSS (공용 X)
import { buyNow } from "../../utils/buynow";

const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) {
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  }
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const items = [
  {
    id: "mk_001",
    name: "KITSUNÉ 폭스 패치 스웨트셔츠",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1520975922284-9d09b56b51a1?w=1200&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "mk_002",
    name: "KITSUNÉ 테일러드 재킷",
    price: 429000,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "mk_003",
    name: "KITSUNÉ 와이드 진",
    price: 219000,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1200&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "mk_004",
    name: "KITSUNÉ 셔츠 드레스",
    price: 299000,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495121605193-b116b5b09a0d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556909114-6aca1b8e1f77?w=1600&q=80&auto=format&fit=crop",
];

// 공용 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandMaisonKitsuneDetail() {
  const navigate = useNavigate();

  const total = useMemo(() => items.reduce((a, c) => a + (c.price || 0), 0), []);

  // 카드별 사이즈 선택 상태
  const [openSku, setOpenSku] = useState(null);     // 열려있는 상품 id
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
    <div className="brandmk">
      {/* HERO */}
      <section className="brandmk-hero">
        <div className="brandmk-hero-inner">
          <div className="brandmk-badge">MAISON KITSUNÉ</div>
          <h1 className="brandmk-title">
            파리지앵 무드, <span>MAISON KITSUNÉ</span>
          </h1>
          <p className="brandmk-sub">
            여유로운 데일리와 위트 있는 포인트. 폭스 아이콘과 함께하는
            메종 키츠네 컬렉션을 만나보세요.
          </p>

          <div className="brandmk-cta">
            <Link
              to="/category?brand=maison-kitsune"
              className="brandmk-btn brandmk-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandmk-btn brandmk-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandmk-stats">
            <li>
              <strong>{items.length}</strong>
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
      <section className="brandmk-section">
        <div className="brandmk-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=maison-kitsune" className="brandmk-more">
            더 보기
          </Link>
        </div>

        <div className="brandmk-grid">
          {items.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandmk-card">
                <div className="brandmk-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandmk-tag">{p.tag}</span>}
                </div>
                <div className="brandmk-card-body">
                  <h3 className="brandmk-name">{p.name}</h3>
                  <div className="brandmk-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandmk-actions">
                    <Link to={`/product/${p.id}`} className="brandmk-small-btn">
                      자세히
                    </Link>
                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandmk-small-btn brandmk-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="brandmk-sizebox">
                      <div className="sizebox-title">사이즈 선택</div>

                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`sizebox-chip ${curSize === s ? "active" : ""}`}
                            onClick={() => onPickSize(p.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <div className="sizebox-actions">
                        <button
                          type="button"
                          className="brandmk-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandmk-small-btn brandmk-small-primary ${
                            !curSize ? "disabled" : ""
                          }`}
                          onClick={() => onBuy(p)}
                          disabled={!curSize}
                        >
                          구매 진행
                        </button>
                      </div>

                      {!curSize && (
                        <div className="sizebox-warn">사이즈를 선택해주세요</div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BENEFIT (독립) */}
      <section id="benefits" className="benefit-wrap">
        <div className="inner">
          <div className="benefit-head">
            <div>
              <div className="benefit-eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="benefit-cta">
              <Link to="/signup" className="btn b-solid">
                회원가입
              </Link>
              <Link to="/mypage/coupons" className="btn b-ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-row">
            <div className="benefit-item">
              <strong>멤버십등급 추가적립</strong>
              <span>구매 금액대별 최대 5% 포인트 적립</span>
            </div>
            <div className="benefit-item">
              <strong>오늘 출발</strong>
              <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
            </div>
            <div className="benefit-item">
              <strong>무료 반품</strong>
              <span>사이즈/컬러 교환 1회 무료(정책 참조)</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandmk-section">
        <div className="brandmk-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandmk-more">F/W STYLING</span>
        </div>

        <div className="brandmk-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandmk-section">
        <div className="brandmk-section-head">
          <h2>MAISON KITSUNÉ 오프라인</h2>
        </div>
        <div className="brandmk-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>MAISON KITSUNÉ 라인업을 현장에서 직접 경험해보세요.</p>
            <a
              className="brandmk-btn brandmk-btn-ghost mk-ghost-onwhite"
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
                "https://images.unsplash.com/photo-1506377711776-4a26f78c5d07?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
