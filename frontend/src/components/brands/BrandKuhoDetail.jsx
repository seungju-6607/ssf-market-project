import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandkuho.css";
import { buyNow } from "../../utils/buynow";

/** 외부/내부 이미지 안전 보정 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/** 샘플 상품 (KUHO 무드의 미니멀/뉴트럴 톤) */
const sampleProducts = [
  {
    id: "kh_001",
    name: "KUHO 미니멀 울 싱글 코트",
    price: 459000,
    image:
      "https://images.unsplash.com/photo-1520975922284-8b456906c813?w=1200&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "kh_002",
    name: "KUHO 캐시미어 터틀 니트",
    price: 219000,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "kh_003",
    name: "KUHO 와이드 트라우저",
    price: 189000,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1200&q=80&auto=format&fit=crop",
    tag: "FW",
  },
  {
    id: "kh_004",
    name: "KUHO 소프트 가디건",
    price: 169000,
    image:
      "https://images.unsplash.com/photo-1520975922284-8b456906c813?w=1200&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1520975922284-8b456906c813?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
];

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandKuhoDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => sampleProducts.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

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
    <div className="brandkh">
      {/* HERO */}
      <section className="brandkh-hero">
        <div className="brandkh-hero-inner">
          <div className="brandkh-badge">KUHO</div>
          <h1 className="brandkh-title">
            미니멀과 구조적 실루엣, <span>KUHO</span>
          </h1>
          <p className="brandkh-sub">
            절제된 라인과 편안한 착용감. KUHO의 F/W 셀렉션을 만나보세요.
          </p>

          <div className="brandkh-cta">
            <Link
              to="/category?brand=kuho"
              className="brandkh-btn brandkh-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandkh-btn brandkh-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandkh-stats">
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
      <section className="brandkh-section">
        <div className="brandkh-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=kuho" className="brandkh-more">
            더 보기
          </Link>
        </div>

        <div className="brandkh-grid">
          {sampleProducts.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandkh-card">
                <div className="brandkh-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandkh-tag">{p.tag}</span>}
                </div>

                <div className="brandkh-card-body">
                  <h3 className="brandkh-name">{p.name}</h3>
                  <div className="brandkh-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  <div className="brandkh-actions">
                    <Link to={`/product/${p.id}`} className="brandkh-small-btn">
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandkh-small-btn brandkh-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="brandkh-sizebox">
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
                          className="brandkh-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandkh-small-btn brandkh-small-primary ${
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

      {/* 혜택/쿠폰 */}
      <section id="benefits" className="brandkh-benefits">
        <div className="brandkh-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
          </div>
          <div className="benefit-right">
            <Link to="/signup" className="brandkh-btn brandkh-btn-primary">
              회원가입
            </Link>
            <Link to="/mypage/coupons" className="brandkh-btn brandkh-btn-ghost">
              쿠폰함
            </Link>
          </div>
        </div>

        <div className="brandkh-benefit-sub">
          <div>
            <strong>멤버십등급 추가적립</strong>
            <span>구매 금액대별 최대 5% 포인트 적립</span>
          </div>
          <div>
            <strong>오늘 출발</strong>
            <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
          </div>
          <div>
            <strong>무료 반품</strong>
            <span>사이즈/컬러 교환 1회 무료(정책 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandkh-section">
        <div className="brandkh-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandkh-more">F/W STYLING</span>
        </div>

        <div className="brandkh-lookbook">
          {lookbook.map((url, i) => (
            <div className="kh-look" key={i}>
              <img src={srcOf(url)} alt={`kh-look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 */}
      <section className="brandkh-section">
        <div className="brandkh-section-head">
          <h2>KUHO 오프라인</h2>
        </div>
        <div className="brandkh-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>KUHO 컬렉션을 현장에서 체험해보세요.</p>
            <a
              className="brandkh-btn brandkh-btn-ghost"
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
                "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop"
              )}
              alt="kuho-store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
