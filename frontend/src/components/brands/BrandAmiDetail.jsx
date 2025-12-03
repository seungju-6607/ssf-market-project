// frontend/src/components/brands/BrandAmiDetail.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./brandami.css";
import { buyNow } from "../../utils/buynow";

/* 유틸 */
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

const SIZES = ["XS", "S", "M", "L", "XL"];

/** AMI 샘플 상품 */
const hotItems = [
  {
    id: "ami-sweat",
    name: "AMI 하트 로고 스웨트셔츠",
    price: 289000,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ami-cardigan",
    name: "AMI 울 카디건",
    price: 359000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ami-coat",
    name: "AMI 더블 브레스티드 코트",
    price: 729000,
    img: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ami-cap",
    name: "AMI 하트 로고 볼캡",
    price: 159000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
];

/** LOOKBOOK */
const lookbook = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
];

export default function BrandAmiDetail() {
  const navigate = useNavigate();

  const sum = useMemo(
    () => hotItems.reduce((a, c) => a + toNum(c.price), 0),
    []
  );

  const [openSku, setOpenSku] = useState(null); // 열려 있는 상품 id
  const [picked, setPicked] = useState({}); // { sku: "M" }

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

  return (
    <div className="brand-ami">
      {/* HERO */}
      <section className="ami-hero with-image">
        <div
          className="ami-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ami-hero-overlay" />
        <div className="ami-hero-inner">
          <div className="ami-hero-badge">AMI</div>
          <h1 className="ami-hero-title">
            파리 감성을 담은 모던 로맨틱, AMI
          </h1>
          <p className="ami-hero-desc">
            담백한 실루엣과 하트 로고 디테일로 완성되는 데일리 룩. AMI
            컬렉션으로 세련된 프렌치 무드를 더해보세요.
          </p>

          <div className="ami-hero-cta">
            <Link to="/brands" className="btn primary hero-btn">
              전체 상품 보기
            </Link>
            <a href="#ami-benefits" className="btn ghost hero-btn">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="ami-stats">
            <li>
              <strong>{hotItems.length}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(sum / 1000).toLocaleString()}K</strong>
              <span>합계(예시)</span>
            </li>
            <li>
              <strong>FW</strong>
              <span>시즌 키 룩</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 상품 GRID */}
      <section className="ami-section">
        <div className="ami-head">
          <h2>지금 핫한 아이템</h2>
          <Link to="/category?brand=ami" className="link-more">
            더보기
          </Link>
        </div>

        <div className="ami-grid">
          {hotItems.map((p) => {
            const opened = openSku === p.id;
            const size = picked[p.id] || "";

            return (
              <article className="ami-card" key={p.id}>
                <div className="ami-thumb">
                  {p.badges?.length ? (
                    <div className="ami-badges">
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

                <div className="ami-meta">
                  <div className="ami-name">{p.name}</div>
                  <div className="ami-price">{fmt(toNum(p.price))}</div>

                  <div className="ami-actions">
                    <Link to={`/product/${p.id}`} className="btn ghost">
                      자세히
                    </Link>
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => openPicker(p.id)}
                    >
                      바로구매
                    </button>
                  </div>

                  {/* 사이즈 선택 박스 */}
                  {opened && (
                    <div className="sizebox">
                      <div className="sizebox-title">사이즈 선택</div>
                      <div className="sizebox-chips">
                        {SIZES.map((s) => (
                          <button
                            key={s}
                            type="button"
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
                          type="button"
                          className="btn ghost"
                          onClick={() => setOpenSku(null)}
                        >
                          닫기
                        </button>
                        <button
                          type="button"
                          className="btn primary"
                          disabled={!size}
                          onClick={() => onBuy(p)}
                        >
                          구매 진행
                        </button>
                      </div>
                      {!size && (
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

      {/* BENEFIT */}
      <section id="ami-benefits" className="ami-benefit">
        <div className="inner">
          <div className="signup-card ami-signup">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>AMI 전용 첫 구매 10,000원 쿠폰</h3>
              <p>
                회원가입만 해도 AMI 컬렉션에 즉시 사용 가능한 웰컴 쿠폰을
                드립니다.
              </p>
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
              <div className="tit">시즌오프 우선 안내</div>
              <p>AMI 시즌오프와 리미티드 드롭을 가장 먼저 만나보세요.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립.</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목 제외).</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료(정책 준수).</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="ami-section">
        <div className="ami-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="ami-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                alt={`look-${i}`}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
