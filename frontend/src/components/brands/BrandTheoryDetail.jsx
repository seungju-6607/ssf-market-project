import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandtheory.css";  // Theory 전용 CSS (공용 없이 독립)
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
    id: "th_001",
    name: "THEORY 크롭 카디건",
    price: 289000,
    image:
      "https://images.unsplash.com/photo-1592877394885-5b47fd3f83d6?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "th_002",
    name: "THEORY 미니멀 울 블렌드 코트",
    price: 719000,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "th_003",
    name: "THEORY 와이드 팬츠",
    price: 359000,
    image:
      "https://images.unsplash.com/photo-1618933979399-ef7b1e5e5a22?w=900&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "th_004",
    name: "THEORY 버튼업 셔츠",
    price: 259000,
    image:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?w=900&q=80&auto=format&fit=crop",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592877394885-5b47fd3f83d6?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618933979399-ef7b1e5e5a22?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=1600&q=80&auto=format&fit=crop",
];

// 공용 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandTheoryDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => items.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 카드별 사이즈 선택 UI 오픈/선택 상태
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
    if (!size) return; // 방어
    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.image },
      1,
      navigate,
      { size }
    );
  };

  return (
    <div className="brandth">
      {/* HERO */}
      <section className="brandth-hero">
        <div className="brandth-hero-inner">
          <div className="brandth-badge">THEORY</div>
          <h1 className="brandth-title">
            세련된 미니멀리즘, <span>THEORY</span>
          </h1>
          <p className="brandth-sub">
            절제된 실루엣과 고급 소재, 매일 입기 좋은 컨템포러리 스타일을 만나보세요.
          </p>

          <div className="brandth-cta">
            <Link
              to="/category?brand=theory"
              className="brandth-btn brandth-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandth-btn brandth-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandth-stats">
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
      <section className="brandth-section">
        <div className="brandth-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=theory" className="brandth-more">
            더 보기
          </Link>
        </div>

        <div className="brandth-grid">
          {items.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandth-card">
                <div className="brandth-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandth-tag">{p.tag}</span>}
                </div>

                <div className="brandth-card-body">
                  <h3 className="brandth-name">{p.name}</h3>
                  <div className="brandth-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandth-actions">
                    <Link to={`/product/${p.id}`} className="brandth-small-btn">
                      자세히
                    </Link>
                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandth-small-btn brandth-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="brandth-sizebox">
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
                          className="brandth-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandth-small-btn brandth-small-primary ${
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

      {/* 혜택 (공용 없이 독립 블록) */}
      <section id="benefits" className="th-benefit">
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
      <section className="brandth-section">
        <div className="brandth-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandth-more">F/W STYLING</span>
        </div>

        <div className="brandth-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandth-section">
        <div className="brandth-section-head">
          <h2>THEORY 오프라인</h2>
        </div>
        <div className="brandth-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>THEORY 라인업을 현장에서 직접 경험해보세요.</p>
            <a
              className="brandth-btn brandth-btn-ghost store-map-link"
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
                "https://images.unsplash.com/photo-1601758125946-6ec2ef64243a?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
