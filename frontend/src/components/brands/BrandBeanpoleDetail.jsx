import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandbeanpole.css";
import { buyNow } from "../../utils/buynow";

/** 외부/내부 이미지 경로 안전 보정 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/** 샘플 상품(Beanpole 느낌) */
const sampleProducts = [
  {
    id: "bp_001",
    name: "BEANPOLE 울 블렌드 맥 코트",
    price: 289000,
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "bp_002",
    name: "BEANPOLE 클래식 더플 코트",
    price: 319000,
    image:
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "bp_003",
    name: "BEANPOLE 체크 셔츠",
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1520975916090-55a77a4d8a2a?w=900&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "bp_004",
    name: "BEANPOLE 테일러드 자켓",
    price: 199000,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop",
    tag: "FW",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1600&q=80&auto=format&fit=crop",
];

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandBeanpoleDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => sampleProducts.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 카드별 사이즈 선택 UI 오픈/선택 상태
  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 id
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

    // buyNow(상품, 수량, navigate, 옵션)
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
  };

  return (
    <div className="brandbp">
      {/* HERO */}
      <section className="brandbp-hero">
        <div className="brandbp-hero-inner">
          <div className="brandbp-badge">BEANPOLE</div>
          <h1 className="brandbp-title">
            클래식의 현재, <span>BEANPOLE</span>
          </h1>
          <p className="brandbp-sub">
            세련된 실루엣과 정제된 디테일. 빈폴의 F/W 아이템으로 일상의 클래식을
            완성하세요.
          </p>

          <div className="brandbp-cta">
            <Link
              to="/category?brand=beanpole"
              className="brandbp-btn brandbp-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brandbp-btn brandbp-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brandbp-stats">
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
      <section className="brandbp-section">
        <div className="brandbp-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=beanpole" className="brandbp-more">
            더 보기
          </Link>
        </div>

        <div className="brandbp-grid">
          {sampleProducts.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brandbp-card">
                <div className="brandbp-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brandbp-tag">{p.tag}</span>}
                </div>

                <div className="brandbp-card-body">
                  <h3 className="brandbp-name">{p.name}</h3>
                  <div className="brandbp-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  {/* 기본 액션 */}
                  <div className="brandbp-actions">
                    <Link
                      to={`/product/${p.id}`}
                      className="brandbp-small-btn"
                    >
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brandbp-small-btn brandbp-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 (열렸을 때만) */}
                  {opened && (
                    <div className="brandbp-sizebox">
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
                          className="brandbp-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brandbp-small-btn brandbp-small-primary ${
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
      <section id="benefits" className="brandbp-benefits">
        <div className="brandbp-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
          </div>
          <div className="benefit-right">
            <Link to="/signup" className="brandbp-btn brandbp-btn-primary">
              회원가입
            </Link>
            <Link to="/mypage/coupons" className="brandbp-btn brandbp-btn-ghost">
              쿠폰함
            </Link>
          </div>
        </div>

        <div className="brandbp-benefit-sub">
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
            <span>사이즈/컬러 교환 1회 무료(정책 기준 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brandbp-section">
        <div className="brandbp-section-head">
          <h2>LOOKBOOK</h2>
        </div>

        <div className="brandbp-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 (선택) */}
      <section className="brandbp-section">
        <div className="brandbp-section-head">
          <h2>BEANPOLE 오프라인</h2>
        </div>
        <div className="brandbp-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>빈폴의 클래식 라인을 현장에서 경험해보세요.</p>
            <a
              className="brandbp-btn brandbp-btn-ghost"
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
                "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&q=80&auto=format&fit=crop"
              )}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
