import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brand10CorsoComo.css";
import { buyNow } from "../../utils/buynow";

const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const SIZES = ["S", "M", "L", "XL"];

/* 상품 */
const hotItems = [
  {
    id: "cc-shirt",
    name: "Cozy Arco Jacket - Brown",
    price: 2150000,
    img: "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/CCPB/25/10/21/GM0025102182299_0_THNAIL_ORGINL_20251024163054094.jpg",
    badges: ["NEW"],
  },
  {
    id: "cc-bag",
    name: "Cozy Michlin - Blue",
    price: 2750000,
    img: "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/CCPB/25/10/21/GM0025102182296_0_THNAIL_ORGINL_20251024163051091.jpg",
    badges: ["BEST"],
  },
  {
    id: "cc-mug",
    name: "Jack Knit - Grey",
    price: 1750000,
    img: "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/CCPB/25/11/14/GM0025111408086_0_THNAIL_ORGINL_20251118154926282.jpg",
    badges: ["HOT"],
  },
  {
    id: "cc-book",
    name: "America - Purple",
    price: 375000,
    img: "https://img.ssfshop.com/cmd/LB_750x1000/src/https://img.ssfshop.com/goods/CCPB/25/11/25/GM0025112572538_0_THNAIL_ORGINL_20251127122124539.jpg",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80",
];

export default function Brand10CorsoComoDetail() {
  const navigate = useNavigate();
  const [openSku, setOpenSku] = useState(null);
  const [picked, setPicked] = useState({});
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
   

  const openPicker = (sku) => setOpenSku((v) => (v === sku ? null : sku));
  const onPick = (sku, s) => setPicked((p) => ({ ...p, [sku]: s }));

  const onBuy = (p) => {
    const size = picked[p.id];
    if (!size) return;
    buyNow(
      { id: p.id, name: p.name, price: p.price, image: p.img },
      1,
      navigate,
      { size }
    );
  };

  const sum = useMemo(() => hotItems.reduce((a, c) => a + toNum(c.price), 0), []);

  return (
    <div className="brand-cc">
      {/* HERO */}
      <section className="cc-hero with-image">
        <div
          className="cc-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="cc-hero-overlay" />
        <div className="cc-hero-inner">
          <div className="cc-hero-badge">10 CORSO COMO</div>
          <h1 className="cc-hero-title">예술과 패션의 경계, 10 CORSO COMO</h1>
          <p className="cc-hero-desc">
            감각적인 디자인과 라이프스타일을 제안하는 10 CORSO COMO.
            당신의 일상에 아트를 입히세요.
          </p>

          <div className="cc-hero-cta">
            <Link to="/brands" className="btn primary">
              전체 상품 보기
            </Link>
            <a href="#cc-benefits" className="btn ghost">
              혜택 보기
            </a>
          </div>

          <ul className="cc-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>ART</strong>
              <span>라인</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 리스트 */}
      <section className="cc-section">
        <div className="cc-head">
          <h2>지금 주목받는 아이템</h2>
        </div>

        <div className="cc-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";
            return (
              <article className="cc-card" key={p.id}>
                <div className="cc-thumb">
                  {p.badges?.length ? (
                    <div className="cc-badges">
                      {p.badges.map((b) => (
                        <span key={b} className={`bdg ${b.toLowerCase()}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <img
                    src={srcOf(p.img)}
                    alt={p.name}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  />
                </div>

                <div className="cc-meta">
                  <div className="cc-name">{p.name}</div>
                  <div className="cc-price">{fmt(p.price)}</div>
                  <div className="cc-actions">
                  
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {opened && (
                    <div className="sizebox">
                      <div className="sizebox-title">사이즈 선택</div>
                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            className={`sizebox-chip ${
                              size === s ? "active" : ""
                            }`}
                            onClick={() => onPick(p.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="sizebox-actions">
                        <button
                          className="btn ghost"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          className="btn primary"
                          disabled={!size}
                          onClick={() => onBuy(p)}
                        >
                          구매 진행
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* BENEFIT */}
      <section id="cc-benefits" className="cc-benefit">
        <div className="inner">
          <div className="signup-card cc-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>10 CORSO COMO 첫 구매 ₩10,000 쿠폰</h3>
              <p>회원가입 즉시 사용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <Link to="/signup" className="btn primary">
                회원가입
              </Link>
              <Link to="/mypage/coupons" className="btn ghost">
                쿠폰함
              </Link>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="benefit-card">
              <div className="tit">아트 콜라보</div>
              <p>세계 아티스트와 협업한 한정판 디자인.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">감각적인 매장</div>
              <p>패션, 예술, 음악이 공존하는 공간 경험.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="cc-section">
        <div className="cc-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="cc-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img src={srcOf(src)} alt={`look-${i}`} />
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
