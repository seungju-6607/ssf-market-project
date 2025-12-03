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
    name: "BEAKER ORIGINAL Women Knit Collar Boucle Half Outer - Ash",
    price: 489250,
    image:
      "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/MCBR/25/10/30/GM0025103069001_0_THNAIL_ORGINL_20251120105146972.jpg",
    tag: "NEW",
  },
  {
    id: "bk_002",
    name: "Daisy Fleece Jacket - Navy",
    price: 216600,
    image:
      "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/MCBR/25/11/21/GM0025112164994_0_THNAIL_ORGINL_20251127155010589.jpg",
    tag: "BEST",
  },
  {
    id: "bk_003",
    name: "Men Dobby Denim Work Blouson - Ash",
    price: 603250,
    image:
      "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/MCBR/25/11/18/GM0025111835852_0_THNAIL_ORGINL_20251126113949401.jpg",
    tag: "HOT",
  },
  {
    id: "bk_004",
    name: "Nerd House Sweatpants Grey - Grey",
    price: 69000,
    image:
      "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/MCBR/25/11/19/GM0025111942572_0_THNAIL_ORGINL_20251124142715446.jpg",
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
  const name = "더좋은강남아카데미";
  const floor = "4층";
  const address = `${name} ${floor}`;
  const encoded = useMemo(() => encodeURIComponent(address), [address]);
  const [copied, setCopied] = useState(false);
 const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    
      const el = document.createElement("textarea");
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
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
              to="/brands"
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
            <Link to="/mypage/coupons" className="brandbk-btn brandbk-btn-ghost">
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
        <div className="store-card-head2">
          <div className="store-name2">
            <strong>{name}</strong>
            <span className="store-floor">{floor}</span>
          </div>
        </div>

        <div className="store-info-grid">
          <div className="store-info">
            <div className="info-row">
              <span className="info-key">주소</span>
              <span className="info-val">{address}</span>
              <button className="mini-btn" onClick={copyAddr}>
                {copied ? "복사됨!" : "주소복사"}
              </button>
            </div>

            <div className="info-row">
              <span className="info-key">영업시간</span>
              <span className="info-val">평일 10:00 ~ 19:00 (주말/공휴일 휴무)</span>
            </div>

            <div className="cta-wrap">
              <a
                className="cta-btn naver"
                href={`https://map.naver.com/p/search/${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                네이버 지도로 길찾기
              </a>
              <a
                className="cta-btn kakao"
                href={`https://map.kakao.com/?q=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                카카오맵으로 길찾기
              </a>
              <a
                className="cta-btn google"
                href={`https://www.google.com/maps/search/?api=1&query=${encoded}`}
                target="_blank" rel="noopener noreferrer"
              >
                구글 지도로 길찾기
              </a>
            </div>
          </div>

          <div className="store-map">
            {/*구글 지도*/}
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encoded}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="store-tips">
          🚗 자차 이용 시 목적지를 <b>{address}</b>로 설정해주세요.  
          대중교통 이용 시, 네이버/카카오 길찾기에서 실시간 환승 정보를 확인할 수 있어요.
        </div>
      </section>
    </div>
  );
}
