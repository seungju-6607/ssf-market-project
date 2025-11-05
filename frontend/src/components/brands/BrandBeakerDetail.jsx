import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandbeaker.css";
import { buyNow } from "../../utils/buynow";

const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const sampleProducts = [
  {
    id: "bk_001",
    name: "BEAKER 클래식 싱글 코트",
    price: 279000,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "bk_002",
    name: "BEAKER 캐시미어 가디건",
    price: 149000,
    image:
      "https://images.unsplash.com/photo-1520975918318-7bcd4294b26f?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "bk_003",
    name: "BEAKER 스트라이프 셔츠",
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "bk_004",
    name: "BEAKER 울 머플러",
    price: 69000,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80&auto=format&fit=crop",
    tag: "FW",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
];

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandBeakerDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => sampleProducts.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 카드별 사이즈 선택 상태
  const [openSku, setOpenSku] = useState(null);        // 열려있는 상품 id
  const [pickedSize, setPickedSize] = useState({});    // { [sku]: "M" }

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
    <div className="brandbk">
      {/* HERO */}
      <section className="brandbk-hero">
        <div className="brandbk-hero-inner">
          <div className="brandbk-badge">BEAKER</div>
          <h1 className="brandbk-title">
            컨템포러리 라이프스타일, <span>BEAKER</span>
          </h1>
          <p className="brandbk-sub">
            라이프스타일과 패션이 공존하는 공간, BEAKER의 감성을 만나보세요.
          </p>

          <div className="brandbk-cta">
            <Link
              to="/category?brand=beaker"
              className="brandbk-btn brandbk-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandbk-btn brandbk-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandbk-stats">
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
      <section className="brandbk-section">
        <div className="brandbk-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=beaker" className="brandbk-more">
            더 보기
          </Link>
        </div>

        <div className="brandbk-grid">
          {sampleProducts.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandbk-card">
                <div className="brandbk-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandbk-tag">{p.tag}</span>}
                </div>

                <div className="brandbk-card-body">
                  <h3 className="brandbk-name">{p.name}</h3>
                  <div className="brandbk-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandbk-actions">
                    <Link to={`/product/${p.id}`} className="brandbk-small-btn">
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandbk-small-btn brandbk-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="brandbk-sizebox">
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
                          className="brandbk-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandbk-small-btn brandbk-small-primary ${
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
      <section id="benefits" className="brandbk-benefits">
        <div className="brandbk-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
          </div>
          <div className="benefit-right">
            <Link to="/signup" className="brandbk-btn brandbk-btn-primary">
              회원가입
            </Link>
            <Link to="/coupon" className="brandbk-btn brandbk-btn-ghost">
              쿠폰함
            </Link>
          </div>
        </div>

        <div className="brandbk-benefit-sub">
          <div className="sub-card">
            <strong>멤버십등급 추가적립</strong>
            <span>구매 금액대별 최대 5% 포인트 적립</span>
          </div>
          <div className="sub-card">
            <strong>오늘 출발</strong>
            <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
          </div>
          <div className="sub-card">
            <strong>무료 반품</strong>
            <span>사이즈/컬러 교환 1회 무료(자세한 기준은 정책 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandbk-section">
        <div className="brandbk-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandbk-more">F/W STYLING</span>
        </div>

        <div className="brandbk-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item bk-look">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandbk-section">
        <div className="brandbk-section-head">
          <h2>BEAKER 오프라인</h2>
        </div>
        <div className="brandbk-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>비이커의 감각적인 라인을 현장에서 직접 경험해보세요.</p>
            <a
              className="brandbk-btn brandbk-btn-ghost"
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
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
