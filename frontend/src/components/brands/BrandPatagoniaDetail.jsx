import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandpatagonia.css"; // 파타고니아 전용 스타일
import { buyNow } from "../../utils/buynow"; // 프로젝트에 있으면 사용. 없으면 폴백으로 checkout 이동합니다.

const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) {
    return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop";
  }
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const items = [
  {
    id: "ptg_001",
    name: "파타고니아 다운 재킷",
    price: 359000,
    image:
      "https://images.unsplash.com/photo-1619291654229-b0d38c74f988?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "ptg_002",
    name: "파타고니아 플리스 자켓",
    price: 219000,
    image:
      "https://images.unsplash.com/photo-1599949787562-d6f63f0f7f3c?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "ptg_003",
    name: "파타고니아 하이킹 팬츠",
    price: 179000,
    image:
      "https://images.unsplash.com/photo-1600181951627-600d93f2a6c1?w=900&q=80&auto=format&fit=crop",
  },
  {
    id: "ptg_004",
    name: "파타고니아 코튼 티셔츠",
    price: 69000,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80&auto=format&fit=crop",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518131678677-44e3bafe2421?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526481280698-8fcc07b0a3f3?w=1600&q=80&auto=format&fit=crop",
];

// 공통 사이즈 (필요시 브랜드별 커스터마이징 가능)
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandPatagoniaDetail() {
  const navigate = useNavigate();
  const total = useMemo(
    () => items.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열린 상품 id
  const [pickedSize, setPickedSize] = useState({}); // { sku: size }

  const openPicker = (sku) => setOpenSku((prev) => (prev === sku ? null : sku));
  const onPickSize = (sku, size) => setPickedSize((prev) => ({ ...prev, [sku]: size }));

  const onBuy = (p) => {
    const size = pickedSize[p.id];
    if (!size) return; // 안전장치 — 버튼은 비활성화되어 있어야 함

    try {
      // 프로젝트에 buyNow 유틸이 있으면 이걸 쓰고, 내부에서 navigate 처리
      buyNow(
        {
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
        },
        1,
        navigate,
        { size }
      );
    } catch (e) {
      // buyNow 없을 경우 폴백으로 체크아웃 페이지로 이동
      navigate(`/checkout?sku=${p.id}&qty=1&size=${encodeURIComponent(size)}`);
    }
  };

  return (
    <div className="brandptg">
      {/* HERO */}
      <section className="brandptg-hero">
        <div className="brandptg-hero-inner">
          <div className="brandptg-badge">PATAGONIA</div>
          <h1 className="brandptg-title">
            자연과 함께하는 <span>파타고니아</span>
          </h1>
          <p className="brandptg-sub">
            환경 보호를 위한 지속 가능한 패션, 아웃도어의 진정한 가치를 전합니다.
          </p>

          <div className="brandptg-cta">
            <Link
              to="/category?brand=patagonia"
              className="brandptg-btn brandptg-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandptg-btn brandptg-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandptg-stats">
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
      <section className="brandptg-section">
        <div className="brandptg-section-head">
          <h2>지금 인기 아웃도어</h2>
          <Link to="/category?brand=patagonia" className="brandptg-more">
            더 보기
          </Link>
        </div>

        <div className="brandptg-grid">
          {items.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandptg-card">
                <div className="brandptg-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandptg-tag">{p.tag}</span>}
                </div>
                <div className="brandptg-card-body">
                  <h3 className="brandptg-name">{p.name}</h3>
                  <div className="brandptg-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>
                  <div className="brandptg-actions">
                    <Link to={`/product/${p.id}`} className="brandptg-small-btn">
                      자세히
                    </Link>

                    <button
                      type="button"
                      className="brandptg-small-btn brandptg-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {opened && (
                    <div className="brandptg-sizebox">
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
                          className="brandptg-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandptg-small-btn brandptg-small-primary ${!curSize ? "disabled" : ""}`}
                          onClick={() => onBuy(p)}
                          disabled={!curSize}
                        >
                          구매 진행
                        </button>
                      </div>

                      {!curSize && <div className="sizebox-warn">사이즈를 선택해주세요</div>}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BENEFIT */}
      <section id="benefits" className="ptg-benefit">
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
              <strong>친환경 포장</strong>
              <span>모든 상품은 재활용 가능한 포장재로 배송됩니다.</span>
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
      <section className="brandptg-section">
        <div className="brandptg-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brandptg-more">F/W OUTDOOR STYLE</span>
        </div>

        <div className="brandptg-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* STORE */}
      <section className="brandptg-section">
        <div className="brandptg-section-head">
          <h2>파타고니아 오프라인</h2>
        </div>
        <div className="brandptg-store">
          <div className="store-text">
            <h3>파타고니아 명동점</h3>
            <p>지속가능한 패션을 경험할 수 있는 플래그십 매장입니다.</p>
            <a
              className="brandptg-btn brandptg-btn-ghost store-map-link"
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
                "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
