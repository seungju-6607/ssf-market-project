import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brand8seconds.css";
import { buyNow } from "../../utils/buynow";

/** 외부/내부 이미지 경로 안전 보정 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/** 샘플 상품(8SECONDS 느낌) – 필요하면 나중에 실제 데이터로 교체 */
const sampleProducts = [
  {
    id: "8s_001",
    name: "8SECONDS 기모 후드 스웨트",
    price: 45900,
    image:
      "https://images.unsplash.com/photo-1548883354-88d27c6d0ab9?w=900&q=80&auto=format&fit=crop",
    tag: "NEW",
  },
  {
    id: "8s_002",
    name: "8SECONDS 울 블렌드 코트",
    price: 159000,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
    tag: "BEST",
  },
  {
    id: "8s_003",
    name: "8SECONDS 데님 와이드 팬츠",
    price: 69900,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80&auto=format&fit=crop",
    tag: "HOT",
  },
  {
    id: "8s_004",
    name: "8SECONDS 퀼팅 다운 베스트",
    price: 89000,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=80&auto=format&fit=crop",
    tag: "FW",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80&auto=format&fit=crop",
];

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function Brand8SecondsDetail() {
  const navigate = useNavigate();

  const total = useMemo(
    () => sampleProducts.reduce((a, c) => a + (c.price || 0), 0),
    []
  );

  // 카드별 사이즈 선택 UI 오픈/선택 상태
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
    <div className="brand8s">
      {/* HERO */}
      <section className="brand8s-hero">
        <div className="brand8s-hero-inner">
          <div className="brand8s-badge">8SECONDS</div>
          <h1 className="brand8s-title">
            새로운 베이직, <span>8SECONDS</span>
          </h1>
          <p className="brand8s-sub">
            일상이 더 편해지는 핏과 컬러. 이번 시즌 8SECONDS F/W 컬렉션을
            만나보세요.
          </p>

          <div className="brand8s-cta">
            <Link
              to="/category?brand=8seconds"
              className="brand8s-btn brand8s-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brand8s-btn brand8s-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brand8s-stats">
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
      <section className="brand8s-section">
        <div className="brand8s-section-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=8seconds" className="brand8s-more">
            더 보기
          </Link>
        </div>

        <div className="brand8s-grid">
          {sampleProducts.map((p) => {
            const opened = openSku === p.id;
            const curSize = pickedSize[p.id] || "";

            return (
              <article key={p.id} className="brand8s-card">
                <div className="brand8s-card-thumb">
                  <img src={srcOf(p.image)} alt={p.name} />
                  {p.tag && <span className="brand8s-tag">{p.tag}</span>}
                </div>

                <div className="brand8s-card-body">
                  <h3 className="brand8s-name">{p.name}</h3>
                  <div className="brand8s-price">
                    ₩{Number(p.price || 0).toLocaleString()}
                  </div>

                  {/* 기본 액션 */}
                  <div className="brand8s-actions">
                    <Link
                      to={`/product/${p.id}`}
                      className="brand8s-small-btn"
                    >
                      자세히
                    </Link>

                    {/* 바로구매 → 사이즈 선택 열기 */}
                    <button
                      type="button"
                      className="brand8s-small-btn brand8s-small-primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 (열렸을 때만) */}
                  {opened && (
                    <div className="brand8s-sizebox">
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
                          className="brand8s-small-btn"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className={`brand8s-small-btn brand8s-small-primary ${
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
      <section id="benefits" className="brand8s-benefits">
        <div className="brand8s-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
          </div>
          <div className="benefit-right">
            <Link to="/signup" className="brand8s-btn brand8s-btn-primary">
              회원가입
            </Link>
            <Link to="/coupon" className="brand8s-btn brand8s-btn-ghost">
              쿠폰함
            </Link>
          </div>
        </div>

        <div className="brand8s-benefit-sub">
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
            <span>사이즈/컬러 교환 1회 무료(자세한 기준은 정책 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="brand8s-section">
        <div className="brand8s-section-head">
          <h2>LOOKBOOK</h2>
          <span className="brand8s-more">F/W STYLING</span>
        </div>

        <div className="brand8s-lookbook">
          {lookbook.map((url, i) => (
            <div key={i} className="lookbook-item">
              <img src={srcOf(url)} alt={`look-${i}`} />
            </div>
          ))}
        </div>
      </section>

      {/* 오프라인 매장 (선택) */}
      <section className="brand8s-section">
        <div className="brand8s-section-head">
          <h2>8SECONDS 오프라인</h2>
        </div>
        <div className="brand8s-store">
          <div className="store-text">
            <h3>더좋은 강남 아카데미 4층 팝업</h3>
            <p>새로운 컬러 팔레트와 스테디 실루엣을 직접 체험하세요.</p>
            <a
              className="brand8s-btn brand8s-btn-ghost"
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
