import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandkuhoplus.css"; // 구호플러스 전용 CSS (공용 미사용)
import { buyNow } from "../../utils/buynow";

const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const items = [
  {
    id: "kuhop_001",
    name: "KUHO PLUS 릴랙스 재킷",
    price: 329000,
    image:
      "https://images.unsplash.com/photo-1520974735194-5f0435f1ad15?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "kuhop_002",
    name: "KUHO PLUS 와이드 팬츠",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "kuhop_003",
    name: "KUHO PLUS 소프트 셔츠",
    price: 149000,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80&auto=format&fit=crop",
    tag: "FW",
  },
  {
    id: "kuhop_004",
    name: "KUHO PLUS 니트 톱",
    price: 119000,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80&auto=format&fit=crop",
];

// 공용 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandKuhoPlusDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => items.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 사이즈 선택 상태
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
    <div className="brandkuhop">
      {/* HERO */}
      <section className="brandkuhop-hero">
        <div className="brandkuhop-hero-inner">
          <div className="brandkuhop-badge">KUHO PLUS</div>
          <h1 className="brandkuhop-title">
            모던 컨템포러리, <span>KUHO PLUS</span>
          </h1>
          <p className="brandkuhop-sub">
            미니멀한 실루엣과 부드러운 텍스처. 구호플러스의 세련된 데일리 룩을 만나보세요.
          </p>

          <div className="brandkuhop-cta">
            <Link
              to="/category?brand=kuhoplus"
              className="brandkuhop-btn brandkuhop-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandkuhop-btn brandkuhop-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandkuhop-stats">
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

      {/* 추천 아이템 */}
      <section className="brandkuhop-section">
        <div className="brandkuhop-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=kuhoplus" className="brandkuhop-more">
            더 보기
          </Link>
        </div>

        <div className="brandkuhop-grid">
          {items.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandkuhop-card">
                <div className="brandkuhop-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandkuhop-tag">{p.tag}</span>}
                </div>

                <div className="brandkuhop-card-body">
                  <h3 className="brandkuhop-name">{p.name}</h3>
                  <div className="brandkuhop-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandkuhop-actions">
                    <Link
                      to={`/product/${p.id}`}
                      className="brandkuhop-small-btn"
                    >
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandkuhop-small-btn brandkuhop-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="brandkuhop-sizebox">
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
                          className="brandkuhop-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandkuhop-small-btn brandkuhop-small-primary ${
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

      {/* 혜택 */}
      <section id="benefits" className="kp-benefit">
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
      <section className="brandkuhop-section">
        <div className="brandkuhop-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandkuhop-more">F/W STYLING</span>
        </div>

        <div className="brandkuhop-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 (길찾기 강조) */}
      <section className="brandkuhop-section">
        <div className="brandkuhop-section-head">
          <h2>KUHO PLUS 오프라인</h2>
        </div>
        <div className="brandkuhop-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>구호플러스 라인업을 현장에서 직접 경험해보세요.</p>

            <a
              className="store-map-link btn btn-locator"
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
