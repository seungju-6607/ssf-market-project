// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./ProductDetail.css";
import { addCart } from "../feature/cart/cartAPI.js";
import {
  toggleWishlistServer,
  isInWishlist,
} from "../hooks/useWishlist.js";

const REVIEWS_PER_PAGE = 10;

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
    `사이즈 정사이즈로 잘 맞아요. 그대로 사길 잘했어요.`,
    `재질이 부드럽고 착용감이 편해서 오래 입어도 괜찮아요.`,
    `배송도 빠르고 포장도 깔끔했습니다.`,
    `가격 대비 퀄리티 좋아요. 자주 손이 갈 아이템입니다.`,
    `기장감이 딱 적당해서 하의랑 매치하기 좋아요.`,
    `생각보다 얇아서 이너랑 같이 입어야 해요.`,
    `세탁해도 변형 없고 구김도 적어요.`,
  ];

  const now = Date.now();
  const count = randInt(30, 50);
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const rating = Math.random() < 0.6 ? 5 : Math.random() < 0.9 ? 4 : 3;
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
  const dispatch = useDispatch();
  const { id } = useParams();

  const fromState = location.state?.product || null;
  const isLogin = localStorage.getItem("isLogin") === "true";

  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  const [wishOn, setWishOn] = useState(false);
  const [wishPending, setWishPending] = useState(false);

  const DIRECT_ITEM_KEY = 10001;

  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0 });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      ? Number(product.price.replace(/[^\d]/g, "")) || 0
      : Number(product?.price || 0);

  // 진입 시 현재 위시 여부
   useEffect(() => {
    if (!product) return;
    setWishOn(isInWishlist(product));
  }, [product]);
  const handleWishClick = async () => {
    if (!product) return;

    if (!isLogin) {
      alert("로그인 후 이용해 주세요.");
      navigate("/login");
      return;
    }

    const loginUser = JSON.parse(
      localStorage.getItem("loginUser") || "{}"
    );
    const email = loginUser.email;
    if (!email) {
      alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      navigate("/login");
      return;
    }

    if (wishPending) return;
    setWishPending(true);
    const prevOn = wishOn;
    setWishOn(!prevOn);

    try {
      const on = await toggleWishlistServer(email, {
        ...product,
        price: normalizedPrice,
      });
      setWishOn(!!on);
    } catch (e) {
      console.error("찜 처리 오류:", e);
      alert("찜 처리 중 오류가 발생했습니다.");
      setWishOn(prevOn);
    } finally {
      setWishPending(false);
    }
  };

  const addToCartClick = () => {
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
    if (!product) return;
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    const payload = {
      product: {
        id: DIRECT_ITEM_KEY,
        code: product.id,
        name: product.name,
        image: product.image || product.img,
        price: normalizedPrice,
      },
      size,
      qty,
    };

    localStorage.setItem("directCheckout", JSON.stringify([payload]));
    localStorage.setItem("orderSource", "direct");
    navigate("/checkout", { state: { order: payload } });
  };

  useEffect(() => {
    if (!product?.id) return;

    const productId = String(product.id);

    try {
      const rawStore = JSON.parse(
        localStorage.getItem("productReviews") || "{}"
      );
      let list = rawStore[productId];

      if (!Array.isArray(list) || list.length === 0) {
        const sample = createSampleReviews(product);
        rawStore[productId] = sample;
        localStorage.setItem("productReviews", JSON.stringify(rawStore));
        list = sample;
      }

      setReviews(list);
      setCurrentPage(1);

      const sum = list.reduce(
        (acc, r) => acc + (Number(r.rating) || 0),
        0
      );
      setRatingInfo({
        average: list.length ? sum / list.length : 0,
        count: list.length,
      });
    } catch (e) {
      console.error("리뷰 로드 오류:", e);
      setReviews([]);
      setRatingInfo({ average: 0, count: 0 });
      setCurrentPage(1);
    }
  }, [product]);

  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const score = Math.min(5, Math.max(1, Math.round(r.rating || 0)));
      stats[score] += 1;
    });
    return stats;
  }, [reviews]);

  const totalPages = Math.max(
    1,
    Math.ceil(reviews.length / REVIEWS_PER_PAGE)
  );

  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [currentPage, reviews]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!product?.id) return;

    if (!newReview.content.trim()) {
      alert("리뷰 내용을 입력해 주세요.");
      return;
    }

    const review = {
      id: Date.now(),
      rating: newReview.rating,
      content: newReview.content,
      username: "방문자",
      createdAt: new Date().toLocaleString(),
    };

    const updated = [review, ...reviews];
    setReviews(updated);
    setCurrentPage(1);

    const sum = updated.reduce((a, r) => a + (Number(r.rating) || 0), 0);
    setRatingInfo({
      average: updated.length ? sum / updated.length : 0,
      count: updated.length,
    });

    try {
      const rawStore = JSON.parse(
        localStorage.getItem("productReviews") || "{}"
      );
      rawStore[product.id] = updated;
      localStorage.setItem("productReviews", JSON.stringify(rawStore));
    } catch (err) {
      console.error("리뷰 저장 오류:", err);
    }

    setNewReview({ rating: 5, content: "" });
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        상품 정보를 찾을 수 없습니다. 목록에서 이미지를 클릭해 다시 들어와 주세요.
      </div>
    );
  }

  // ----- 렌더링 -----
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
            <div className="product-name">{product.name}</div>

            {/* 찜 버튼 */}
            <button
              onClick={handleWishClick}
              className="wishlist-button"
              disabled={wishPending}
              title={wishOn ? "찜 취소" : "찜하기"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={wishOn ? "#ff3333" : "none"}
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 
                  5.67l-1.06-1.06a5.5 5.5 0 0 
                  0-7.78 7.78l1.06 1.06L12 
                  21.23l7.78-7.78 1.06-1.06a5.5 
                  5.5 0 0 0 0-7.78z"
                  stroke={wishOn ? "#ff3333" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="product-price">
            ₩{normalizedPrice.toLocaleString()}
          </div>
          <div className="product-price">
            ₩{normalizedPrice.toLocaleString()}
          </div>

          {/* 옵션 선택 */}
          <div className="product-form-container">
            <label className="form-label">
              사이즈
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="form-select"
              >
                <option value="">선택하세요</option>
                {["XS", "S", "M", "L", "XL"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              수량
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) =>
                  setQty(clampQty(Number(e.target.value)))
                }
                className="form-input"
              />
            </label>

            <div className="button-group">
              <button onClick={addToCartClick} className="cart-button">
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

      {/* 리뷰 영역 */}
      <div className="product-review-section">
        <h2 className="review-title">상품 리뷰</h2>

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

        {/* 리뷰 작성 */}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <div className="review-stars-input">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  type="button"
                  key={value}
                  className={
                    value <= newReview.rating ? "star on" : "star"
                  }
                  onClick={() =>
                    setNewReview((prev) => ({
                      ...prev,
                      rating: value,
                    }))
                  }
                >
                  ★
                </button>
              );
            })}
            <span className="review-rating-label">
              {newReview.rating}점
            </span>
          </div>

          <textarea
            className="review-textarea"
            placeholder="상품 사용 후기를 남겨주세요."
            value={newReview.content}
            onChange={(e) =>
              setNewReview((prev) => ({
                ...prev,
                content: e.target.value,
              }))
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

        {/* 리뷰 리스트 */}
        <div className="review-list">
          {reviews.length === 0 && (
            <p className="review-empty">아직 작성된 리뷰가 없습니다.</p>
          )}

          {currentReviews.map((rv) => (
            <div key={rv.id} className="review-item">
              <div className="review-header">
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < rv.rating ? "star on" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="review-author">
                  {rv.username || "방문자"}
                </span>
                <span className="review-date">{rv.createdAt}</span>
              </div>
              <p className="review-content">{rv.content}</p>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
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
