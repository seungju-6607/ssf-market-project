// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./ProductDetail.css";
import { addCart } from "../feature/cart/cartAPI.js";

const REVIEWS_PER_PAGE = 10; // ✅ 페이지당 리뷰 개수

const randInt = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

const createSampleReviews = (product) => {
  const baseName = product?.name || "이 상품";

  const nicknames = [
    "SSF회원1",
    "SSF회원2",
    "패션러버",
    "옷잘알",
    "데일리룩러버",
    "직장인코디러",
    "캠퍼스룩",
    "심플이즈베스트",
    "옷많은사람",
    "컬러덕후",
    "핏맛집",
    "기장중요",
    "리뷰장인",
    "쇼핑중독",
    "편한옷좋아",
    "꾸안꾸추천",
    "심쿵룩",
    "미니멀스타일",
    "스트릿무드",
    "포멀러버",
  ];

  const templates = [
    `${baseName} 실제로 보니까 사진보다 더 예뻐요. 퀄리티도 좋고 핏도 마음에 듭니다.`,
    `${baseName} 생각보다 두께감이 있어서 지금 계절에 딱이에요.`,
    `색감이 진짜 예뻐요. 코디하기도 편하고 매일 입게 될 것 같아요.`,
    `사이즈 정사이즈로 잘 맞아요. 한 치수 업/다운 고민했는데 그대로 사길 잘했어요.`,
    `재질이 부드럽고 착용감이 편해서 오래 입어도 괜찮아요.`,
    `배송도 빠르고 포장도 깔끔하게 와서 기분 좋았어요.`,
    `가격 대비 퀄리티 좋아요. 자주 손이 갈 것 같은 아이템입니다.`,
    `기장감이 딱 적당해서 하의랑 매치하기 좋아요.`,
    `생각보다 얇아서 이너랑 같이 입어야 할 것 같아요.`,
    `세탁했을 때 변형 없고 구김도 적어서 만족합니다.`,
    `선물용으로 샀는데 받는 사람이 너무 좋아했어요.`,
    `핏이 깔끔해서 출근룩으로 자주 입고 있어요.`,
    `유행 안 탈 디자인이라 오래 입을 수 있을 것 같아요.`,
    `컬러가 고급스럽고 어디에나 잘 어울립니다.`,
    `살짝 여유 있는 핏이라 편하고 멋스럽게 떨어져요.`,
    `사진이랑 거의 똑같고, 실물이 더 예쁜 느낌이에요.`,
    `한 번 입어보고 바로 다른 색도 장바구니에 넣었어요.`,
    `봄/가을에 입기 좋은 두께감이에요.`,
    `안감이 있어서 비침 걱정 없이 입을 수 있습니다.`,
    `가격만 조금 더 착했으면 완벽했을 것 같아요.`,
  ];

  const now = Date.now();
  const count = randInt(30, 50);
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const rating = r < 0.6 ? 5 : r < 0.9 ? 4 : 3;

    const nickname = nicknames[randInt(0, nicknames.length - 1)];
    const template = templates[randInt(0, templates.length - 1)];

    const offsetDays = randInt(1, 60);
    const createdAt = new Date(
      now - offsetDays * 24 * 60 * 60 * 1000
    ).toLocaleString();

    reviews.push({
      id: now - i,
      rating,
      username: nickname,
      content: template,
      createdAt,
    });
  }

  return reviews;
};





export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const fromState = location.state?.product || null;

  const isLogin = localStorage.getItem("isLogin") === "true";

  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const DIRECT_ITEM_KEY = 10001; // TODO: API 연동 시 치환 예정

  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0 });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 리뷰 페이지

  const product = useMemo(() => {
    if (fromState && fromState.id) return fromState;
    try {
      return JSON.parse(localStorage.getItem("lastProduct")) || null;
    } catch {
      return null;
    }
  }, [fromState, id]);

  const clampQty = (v) => (v < 1 ? 1 : v > 99 ? 99 : v);

  const normalizedPrice =
    typeof product?.price === "string"
      ? Number(String(product.price).replace(/[^\d]/g, "")) || 0
      : Number(product?.price || 0);

  useEffect(() => {
    if (!product?.id) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setIsWished(wishlist.some((w) => String(w.id) === String(product.id)));
    } catch {
      setIsWished(false);
    }
  }, [product]);

  const toggleWish = () => {
    if (!product) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const i = wishlist.findIndex((w) => String(w.id) === String(product.id));
      if (i >= 0) {
        wishlist.splice(i, 1);
        setIsWished(false);
      } else {
        wishlist.push({
          id: product.id,
          name: product.name || "",
          image: product.image || product.img,
          price: normalizedPrice,
          addedAt: Date.now(),
        });
        setIsWished(true);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {}
  };

  

  /* 장바구니에 상품 추가 */
  const addToCart = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    if (!isLogin) {
      alert("로그인 후 이용해 주세요.");
      navigate("/login");
      return;
    }

    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    dispatch(addCart(DIRECT_ITEM_KEY, size));
  };



  const goCheckout = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    const payload = {
      product: {
        id: DIRECT_ITEM_KEY,
        code: product.id,
        name: product.name || "",
        image: product.image || product.img,
        price: normalizedPrice,
      },
      size,
      qty: Number(qty),
    };

    localStorage.setItem("directCheckout", JSON.stringify([payload]));
    localStorage.setItem("orderSource", "direct");
    localStorage.removeItem("cartCheckout");
    localStorage.setItem("lastProduct", JSON.stringify(product));

    navigate("/checkout", { state: { order: payload } });
  };

  useEffect(() => {
    if (!product?.id) return;

    const productId = String(product.id);

    try {
      const raw = localStorage.getItem("productReviews") || "{}";
      const store = JSON.parse(raw);
      let list = store[productId];

      if (!Array.isArray(list) || list.length === 0) {
        const sample = createSampleReviews(product);
        store[productId] = sample;
        localStorage.setItem("productReviews", JSON.stringify(store));
        list = sample;
      }

      setReviews(list);
      setCurrentPage(1); // ✅ 새 상품 로딩 시 첫 페이지로

      if (list.length > 0) {
        const sum = list.reduce(
          (acc, r) => acc + (Number(r.rating) || 0),
          0
        );
        setRatingInfo({
          average: sum / list.length,
          count: list.length,
        });
      } else {
        setRatingInfo({ average: 0, count: 0 });
      }
    } catch (e) {
      console.error("리뷰 불러오기 오류:", e);
      setReviews([]);
      setRatingInfo({ average: 0, count: 0 });
      setCurrentPage(1);
    }
  }, [product]);

  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews || reviews.length === 0) return stats;
    reviews.forEach((r) => {
      const raw = Number(r.rating) || 0;
      const key = Math.min(5, Math.max(1, Math.round(raw)));
      stats[key] += 1;
    });
    return stats;
  }, [reviews]);

  // ✅ 페이징된 리뷰 목록
  const totalPages = Math.max(
    1,
    Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  );

  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [reviews, currentPage]);

  const handleReviewStarClick = (value) => {
    setNewReview((prev) => ({ ...prev, rating: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id) return;

    if (!newReview.rating || !newReview.content.trim()) {
      alert("별점과 내용을 모두 입력해 주세요.");
      return;
    }

    try {
      setSubmittingReview(true);

      const productId = String(product.id);

      const review = {
        id: Date.now(),
        rating: newReview.rating,
        content: newReview.content.trim(),
        username: "방문자",
        createdAt: new Date().toLocaleString(),
      };

      const nextReviews = [review, ...reviews];
      setReviews(nextReviews);

      const sum = nextReviews.reduce(
        (acc, r) => acc + (Number(r.rating) || 0),
        0
      );
      setRatingInfo({
        average: sum / nextReviews.length,
        count: nextReviews.length,
      });

      // ✅ 새 리뷰 등록하면 1페이지로 이동 (최신 리뷰 바로 보이게)
      setCurrentPage(1);

      try {
        const raw = localStorage.getItem("productReviews") || "{}";
        const store = JSON.parse(raw);
        store[productId] = nextReviews;
        localStorage.setItem("productReviews", JSON.stringify(store));
      } catch (err) {
        console.error("리뷰 저장(localStorage) 오류:", err);
      }

      setNewReview({ rating: 5, content: "" });
    } catch (e) {
      console.error("리뷰 등록 오류:", e);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        상품 정보를 찾을 수 없습니다. 목록에서 이미지를 클릭해 다시 들어와 주세요.
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">상품 상세</h1>

      <div className="product-detail-grid">
        <div>
          <img
            src={product.image || product.img}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div>
          <div className="product-name-section">
            <div className="product-name">{product.name || "상품명"}</div>

            <button
              onClick={toggleWish}
              className="wishlist-button"
              title={isWished ? "찜 취소" : "찜하기"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isWished ? "#ff4444" : "none"}
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke={isWished ? "#ff4444" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="product-price">
            {normalizedPrice ? `₩${normalizedPrice.toLocaleString()}` : ""}
          </div>

          <div className="product-rating-summary">
            <span className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(ratingInfo.average) ? "star on" : "star"
                  }
                >
                  ★
                </span>
              ))}
            </span>
            <span className="rating-text">
              {ratingInfo.count > 0
                ? `${ratingInfo.average.toFixed(1)} / 5.0 (${ratingInfo.count}개 리뷰)`
                : "아직 리뷰가 없습니다."}
            </span>
          </div>

          <div className="product-form-container">
            <label className="form-label">
              <span className="form-label-text">사이즈</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="form-select"
              >
                <option value="">선택하세요</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>

            <label className="form-label">
              <span className="form-label-text">수량</span>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                className="form-input"
              />
            </label>

            <div className="button-group">
              <button onClick={addToCart} className="cart-button">
                장바구니 담기
              </button>
              <button onClick={goCheckout} className="checkout-button">
                바로 결제
              </button>
            </div>

            <Link to="/cart" className="cart-link">
              장바구니로 이동
            </Link>
          </div>
        </div>
      </div>

      <div className="product-review-section">
        <h2 className="review-title">상품 리뷰</h2>

        {/* 리뷰 요약 그래프 */}
        <div className="review-summary">
          <div className="review-summary-head">
            <div className="review-summary-score">
              <span className="score-big">
                {ratingInfo.count > 0
                  ? ratingInfo.average.toFixed(1)
                  : "0.0"}
              </span>
              <span className="score-small">/ 5.0</span>
            </div>
            <div className="review-summary-count">
              {ratingInfo.count}개의 리뷰
            </div>
          </div>

          <div className="review-bars">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats[star] || 0;
              const ratio =
                ratingInfo.count > 0
                  ? Math.round((count / ratingInfo.count) * 100)
                  : 0;
              return (
                <div key={star} className="review-bar">
                  <span className="review-bar-label">{star}점</span>
                  <div className="review-bar-track">
                    <div
                      className="review-bar-fill"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className="review-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 리뷰 작성 폼 */}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <div className="review-stars-input">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  type="button"
                  key={value}
                  className={value <= newReview.rating ? "star on" : "star"}
                  onClick={() => handleReviewStarClick(value)}
                >
                  ★
                </button>
              );
            })}
            <span className="review-rating-label">{newReview.rating}점</span>
          </div>

          <textarea
            className="review-textarea"
            placeholder="상품 사용 후기를 남겨주세요."
            value={newReview.content}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, content: e.target.value }))
            }
          />

          <button
            type="submit"
            className="review-submit-button"
            disabled={submittingReview}
          >
            {submittingReview ? "등록 중..." : "리뷰 등록"}
          </button>
        </form>

        {/* 리뷰 리스트 (페이지네이션 적용) */}
        <div className="review-list">
          {reviews.length === 0 && (
            <p className="review-empty">아직 작성된 리뷰가 없습니다.</p>
          )}

          {currentReviews.map((rv, idx) => (
            <div key={rv.id || idx} className="review-item">
              <div className="review-header">
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < (rv.rating || 0) ? "star on" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="review-author">
                  {rv.username || rv.email || "방문자"}
                </span>
                {rv.createdAt && (
                  <span className="review-date">{rv.createdAt}</span>
                )}
              </div>
              <p className="review-content">{rv.content}</p>
            </div>
          ))}
        </div>

        {/* ✅ 페이지 버튼 */}
        {totalPages > 1 && (
          <div className="review-pagination">
            <button
              type="button"
              className="page-nav"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) => (p > 1 ? p - 1 : p))
              }
            >
              이전
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  type="button"
                  className={
                    page === currentPage
                      ? "page-number active"
                      : "page-number"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              className="page-nav"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) =>
                  p < totalPages ? p + 1 : p
                )
              }
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
