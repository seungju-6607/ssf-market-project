// src/pages/order/Checkout.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDefaultAddress, fetchAddressList, deleteAddress, saveAddress } from "../../feature/order/orderAPI.js";
import { openKakaoPostCode } from "../../utils/postCode.js";
import CardOptionModal from "../../components/order/CardOptionModal.jsx";
import { getPayment } from "../../feature/payment/paymentAPI.js";
import { fetchCouponInfo, consumeCoupon } from "../../feature/coupon/couponAPI.js";

const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

const normalizeOrderItem = (raw) => {
  if (!raw) return null;
  const baseProd = raw.product || raw;
  const id =
    baseProd.id ||
    raw.id ||
    baseProd.code ||
    raw.code ||
    `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const name = baseProd.name || raw.name || raw.title || "상품명";
  const image =
    baseProd.image ||
    baseProd.img ||
    raw.image ||
    raw.img ||
    baseProd.src ||
    raw.src ||
    "";
  const price = toNumber(
    baseProd.price != null ? baseProd.price : raw.price != null ? raw.price : 0
  );
  const size = raw.size || raw.option?.size || "";
  const qty = Number(raw.qty || 1);
  return { product: { id, name, image, price }, size, qty };
};

const getDiscountByCoupon = (subtotal, rawCoupon) => {
  if (!rawCoupon) return 0;
  const ctype = String(rawCoupon.type || "").toLowerCase().trim();
  const min = toNumber(rawCoupon.min);
  if (subtotal < min) return 0;

  let discount = 0;
  const isPercent =
    ctype === "percent" || ctype === "percentage" || ctype === "rate";

  if (isPercent) {
    const rate =
      typeof rawCoupon.rate === "number"
        ? rawCoupon.rate
        : toNumber(rawCoupon.rate);
    discount = Math.floor((subtotal * rate) / 100);
    const cap = toNumber(rawCoupon.max) || toNumber(rawCoupon.amount) || 0;
    if (cap) discount = Math.min(discount, cap);
  } else {
    const amt =
      toNumber(rawCoupon.amount) ||
      toNumber(rawCoupon.value) ||
      toNumber(rawCoupon.name);
    discount = amt;
  }
  return Math.max(0, Math.min(discount, subtotal));
};

const readJSON = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const getCheckoutPayload = (location) => {
  const fromState = location?.state?.order;
  if (fromState) return [normalizeOrderItem(fromState)].filter(Boolean);

  const orderSource = localStorage.getItem("orderSource");
  if (orderSource === "direct") {
    const directCheckout = readJSON("directCheckout", null);
    if (Array.isArray(directCheckout) && directCheckout.length > 0) {
      return directCheckout
        .map((item) => normalizeOrderItem(item))
        .filter(Boolean);
    }
  }

  const cartCheckout = readJSON("cartCheckout", null);
  if (Array.isArray(cartCheckout) && cartCheckout.length > 0) {
    return cartCheckout
      .map((i) =>
        normalizeOrderItem({
          product: {
            id: i.id,
            name: i.name || "",
            image: i.image || "",
            price: toNumber(i.price),
          },
          size: i.size || "",
          qty: Number(i.qty || 1),
        })
      )
      .filter(Boolean);
  }

  const cart = readJSON("cart", []);
  return cart
    .map((i) =>
      normalizeOrderItem({
        product: {
          id: i.product?.id,
          name: i.product?.name || "",
          image: i.product?.image || i.product?.img || "",
          price: toNumber(i.product?.price),
        },
        size: i.size || "",
        qty: Number(i.qty || 1),
      })
    )
    .filter(Boolean);
};

// 결제 아이콘 컴포넌트
const PaymentIcon = ({ method }) => {
  const { key, label, icon } = method;
  const isImg = icon?.startsWith("/");
  const cls = `pay-icon-img${["toss", "naver", "kakao"].includes(key) ? " pay-icon-large" : ""}`;

  return isImg
    ? <img src={icon} alt={label} className={cls} />
    : <span className="pay-icon" aria-hidden>{icon}</span>;
};


export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const defaultAddress = useSelector(state => state.order.defaultAddress);
  const addressList = useSelector(state => state.order.addressList);

  const items = useMemo(() => getCheckoutPayload(location), [location]);

  // 로그인 사용자 정보
  const loginUser = useMemo(() => {
    return JSON.parse(localStorage.getItem("loginUser") || "{}");
  }, []);

  const [couponInfo, setCouponInfo] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponId, setCouponId] = useState("");

  // 결제 방법 목록
  const [paymentData, setPaymentData] = useState({ methods: [], cardBrands: [], installments: [] });

  // 배송 정보
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [memo, setMemo] = useState("");
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // 결제 방법 상태
  const [payMethod, setPayMethod] = useState("kakao");
  const [cardBrand, setCardBrand] = useState("");
  const [installment, setInstallment] = useState("일시불");

  // paymentMethods.json 파일에서 결제 방법 목록 로드
  useEffect(() => {
    fetch("/paymentMethods.json")
      .then((res) => res.json())
      .then((data) => setPaymentData(data));
  }, []);

  useEffect(() => {
    if (!loginUser?.email) {
      setCouponInfo(null);
      return;
    }

    // DB에서 회원에 대한 쿠폰 소지 정보를 가져와 setCouponInfo
    let mounted = true;
    const loadCoupon = async () => {
      setCouponLoading(true);
      try {
        const data = await fetchCouponInfo(loginUser.email);
        if (mounted) setCouponInfo(data || null);
      } catch (error) {
        console.error("쿠폰 조회 실패:", error);
        if (mounted) setCouponInfo(null);
      } finally {
        if (mounted) setCouponLoading(false);
      }
    };

    loadCoupon();
    return () => {
      mounted = false;
    };
  }, [loginUser?.email]);

  // 기본 배송지 조회
  useEffect(() => {
    dispatch(fetchDefaultAddress());
  }, [dispatch]);

  // 배송지 정보를 폼에 채우는 함수
  const fillAddressForm = useCallback((address) => {
    if (!address) return;
    
    setName(address.addrName || "");
    setPhone(address.addrTel || "");
    setEmail(loginUser.email || "");
    setPostcode(address.addrZipcode || "");
    setAddress(address.addrMain || "");
    setAddressDetail(address.addrDetail || "");
    setMemo(address.addrReq || "");
    setSaveAsDefault(address.addrDef === "Y");
  }, [loginUser.email]);

  // 기본 배송지 데이터를 폼에 채우기
  useEffect(() => {
    if (defaultAddress) {
      fillAddressForm(defaultAddress);
    }
  }, [defaultAddress, fillAddressForm]);

  const { methods: paymentMethods, cardBrands, installments } = paymentData;
  const kakaoMethod = useMemo(
    () => paymentMethods.find((m) => m.key === "kakao"),
    [paymentMethods]
  );
  const paymentCards = useMemo(() => {
    const cards = [];
    if (kakaoMethod) {
      cards.push(kakaoMethod);
    }
    cards.push({
      key: "comingsoon",
      label: "준비 중입니다",
      icon: "⏳",
      banner: null,
      disabled: true,
      description: "다른 결제수단 준비중입니다",
    });
    return cards;
  }, [kakaoMethod]);

  // 주소찾기 팝업 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  
  // 배송지 선택 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  // 카드 옵션 모달 상태
  const [isCardOptionModalOpen, setIsCardOptionModalOpen] = useState(false);

  // 새로입력 버튼 클릭시 기존 정보 초기화
  const handleNewAddress = () => {
      setName("");
      setPhone("");
      setEmail("");
      setPostcode("");
      setAddress("");
      setAddressDetail("");
      setMemo("");
      setSaveAsDefault(false);
  }

  // 배송지 선택 버튼 클릭
  const handleSelectAddress = async () => {
    await dispatch(fetchAddressList());
    setIsAddressModalOpen(true);
  };

  // 배송지 선택
  const handleAddressClick = (address, index) => {
    setSelectedAddressIndex(index);
    fillAddressForm(address);
    
    // 배송지 선택 모달창 닫음
    setTimeout(() => {
      setIsAddressModalOpen(false);
      setSelectedAddressIndex(null);
    }, 200);
  };

  // 배송지 삭제
  const handleDeleteAddress = async (addrKey) => {
    if (!window.confirm("정말 이 배송지를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await dispatch(deleteAddress(addrKey));
      // 삭제 후 목록 새로고침
      await dispatch(fetchAddressList());
    } catch (error) {
      console.error("배송지 삭제 실패:", error);
    }
  };

  // 주소찾기 버튼 클릭 시 (카카오 우편번호 API 연동)
  const handleOpenPostcode = (data) => {
    setPostcode(data.zonecode);
    setAddress(data.jibunAddress);
    setIsPostcodeOpen(true);
  };

  // 합계
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + toNumber(it.product?.price) * Number(it.qty || 1),
        0
      ),
    [items]
  );

  const availableCoupon = useMemo(() => {
    if (!couponInfo) return null;
    if (couponInfo.couponYn && couponInfo.couponYn.toUpperCase() !== "Y") return null;
    if (couponInfo.couponEnd) {
      const t = new Date(couponInfo.couponEnd).getTime();
      if (!isNaN(t) && t < Date.now()) return null;
    }
    return couponInfo;
  }, [couponInfo]);

  const selectedCoupon = useMemo(() => {
    if (!availableCoupon) return null;
    return String(availableCoupon.couponId) === String(couponId) ? availableCoupon : null;
  }, [availableCoupon, couponId]);

  const normalizedCoupon = useMemo(() => {
    if (!selectedCoupon) return null;
    return {
      id: selectedCoupon.couponId,
      amount: selectedCoupon.couponCost || selectedCoupon.discount || 0,
      expiresAt: selectedCoupon.couponEnd,
    };
  }, [selectedCoupon]);

  const discount = useMemo(
    () => getDiscountByCoupon(subtotal, normalizedCoupon),
    [subtotal, normalizedCoupon]
  );

  //배송비 2500원으로 고정 - 추후에 지역별 배송비 적용시 수정 필요
  const shipping = 2500;
  const total = Math.max(0, subtotal - discount + shipping);

  useEffect(() => {
//     console.log("[DEBUG] items:", items);
  }, [items]);


  //결제 정보 저장
  const [paymentInfo, setPaymentInfo] = useState({
    "shippingFee": shipping,
    "discountAmount": discount,
    "totalAmount": total
  });

  const handlePayment = async() => {

       //결제 로직 시작
       const receiver = {
         name: name,
         phone: phone,
         zipcode: postcode,
         address1: address,
         address2: addressDetail,
         memo: memo
       };

       await dispatch(saveAddress({
        addrName: name,
        addrTel: phone,
        addrZipcode: postcode,
        addrMain: address,
        addrDetail: addressDetail,
        addrReq: memo,
        addrDef: saveAsDefault ? "Y" : "N",
       }));

       const orderSource = localStorage.getItem("orderSource") || "cart";
       const result = await getPayment(receiver, paymentInfo, items, total, orderSource, selectedCoupon?.couponId);
  }

  if (!items || items.length === 0) {
    return (
      <div className="checkout-page">
        <h2 className="title">주문/결제</h2>
        <p className="empty-info">선택된 상품이 없습니다. 장바구니로 이동해 주세요.</p>
      </div>
    );
  }



  return (
    <div className="checkout-page">
      <h2 className="title">주문/결제</h2>

      <section className="section">
        <h3 className="section-title">상품정보</h3>
        <div className="order-items">
          {items.map((it, idx) => (
            <div className="order-item" key={idx}>
              <img
                className="order-thumb"
                src={
                  it.product?.image ||
                  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                }
                alt={it.product?.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="order-info">
                <div className="order-name">{it.product?.name}</div>
                <div className="order-sub">
                  사이즈: {it.size || "-"} · 수량: {it.qty || 1}
                </div>
              </div>
              <div className="order-price">
                {formatKRW(toNumber(it.product?.price) * Number(it.qty || 1))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">쿠폰 선택</h3>
        {couponLoading ? (
          <p className="no-coupon">쿠폰 정보를 불러오는 중입니다.</p>
        ) : !availableCoupon ? (
          <p className="no-coupon">사용 가능한 쿠폰이 없습니다.</p>
        ) : (
          <>
            <select
              className="coupon-select"
              value={String(couponId)}
              onChange={(e) => setCouponId(e.target.value)}
            >
              <option value="">선택 안 함</option>
              <option value={String(availableCoupon.couponId)}>
                {availableCoupon.couponName} - {formatKRW(toNumber(availableCoupon.couponCost || availableCoupon.amount || availableCoupon.discount))}
              </option>
            </select>
            <p className="coupon-hint">
              적용 할인 예상: <b>{formatKRW(discount)}</b>
            </p>
          </>
        )}
      </section>

      {/* 배송지 정보 */}
      <section className="section shipping-section">
        <div className="section-header">
          <h3 className="section-title">배송지 정보</h3>
          <div className="btn-group">
            <button className="btn-select" onClick={handleSelectAddress}>배송지 선택</button>
            <button className="btn-reset" onClick={handleNewAddress}>새로입력</button>
          </div>
        </div>

        <div className="shipping-form">
          <div className="form-row">
            <label>이름 <span className="required">*</span></label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="받는 분 이름"
            />
          </div>

          <div className="form-row">
            <label>휴대폰 <span className="required">*</span></label>
            <input
              type="text"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
            />
          </div>

          <div className="form-row">
            <label>이메일 주소 <span className="required">*</span></label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-row">
            <label>배송주소 <span className="required">*</span></label>
            <div className="address-input">
              <input
                type="text"
                className="input"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="우편번호"
              />
              <button className="btn-address" onClick={() => openKakaoPostCode(handleOpenPostcode)}>주소찾기</button>
            </div>
            <input
              type="text"
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="기본 주소"
            />
          </div>
          <div className="form-row">
            <label></label> {/* 빈 라벨로 정렬 유지 */}
            <input
              type="text"
              className="input"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="상세 주소"
            />
          </div>

          <div className="form-row">
            <label>배송 메시지</label>
            <input
              type="text"
              className="input"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="배송 메시지를 입력해주세요"
            />
          </div>
          <div className="form-row checkbox-row">
            <label></label>
            <label className="checkbox-default">
              <input
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
              />
              <span>이 주소를 기본 배송지로 저장할게요</span>
            </label>
          </div>
        </div>
      </section>
      

      {/* 결제 방법 */}
      <section className="section payment-section">
        <div className="payment-header">
          <h3 className="section-title payment-title-center">결제수단</h3>
          <button className="card-benefit-btn" type="button" onClick={() => setIsCardOptionModalOpen(true)}>
            카드혜택 <span className="question-mark">?</span>
          </button>
          {isCardOptionModalOpen && (
            <CardOptionModal open={isCardOptionModalOpen} onClose={() => setIsCardOptionModalOpen(false)} />
          )}
        </div>

        <div className="pay-grid">
          {paymentCards.map((m) => {
            const isActive = payMethod === m.key;
            const isDisabled = m.disabled;
            return (
              <button
                type="button"
                key={m.key}
                className={`pay-card ${isActive ? "is-active" : ""} ${
                  isDisabled ? "is-disabled" : ""
                }`}
                onClick={() => !isDisabled && setPayMethod(m.key)}
                aria-pressed={isActive}
                disabled={isDisabled}
              >
                {m.banner && <div className="pay-banner">{m.banner}</div>}
                <div className="pay-card-content">
                  <PaymentIcon method={m} />
                  <span className="pay-label">{m.label}</span>
                  {isDisabled && (
                    <span className="pay-coming-note">{m.description}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {payMethod === "card" && (
          <div className="pay-card-area">
            <div className="pay-row">
              <label className="pay-label-inline">신용카드</label>
              <select
                className="pay-select"
                value={cardBrand}
                onChange={(e) => setCardBrand(e.target.value)}
              >
                {cardBrands.map((b) => (
                  <option key={b} value={b === "카드선택" ? "" : b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                className="pay-select"
                value={installment}
                onChange={(e) => setInstallment(e.target.value)}
              >
                {installments.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <p className="pay-help">* 무이자/부분무이자 여부는 결제 단계에서 카드사 정책에 따라 안내됩니다.</p>
          </div>
        )}
      </section>


      {/* 합계 */}
      <section className="section">
        <div className="sum-row">
          <span>총 상품 금액</span>
          <b>{formatKRW(subtotal)}</b>
        </div>
        <div className="sum-row">
          <span>쿠폰 할인</span>
          <b>-{formatKRW(discount)}</b>
        </div>
        <div className="sum-row">
          <span>배송비</span>
          <b>{formatKRW(shipping)}</b>
        </div>
        <div className="sum-row total">
          <span>최종 결제 금액</span>
          <b>{formatKRW(total)}</b>
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          결제하기
        </button>

        
      </section>

      {/* 배송지 선택 모달 */}
      {isAddressModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="modal-content address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">배송지 선택</h3>
              <button className="modal-close" onClick={() => setIsAddressModalOpen(false)}>×</button>
            </div>
            <div className="address-list">
              {addressList.length === 0 ? (
                <p className="empty-address">저장된 배송지가 없습니다.</p>
              ) : (
                addressList.map((address, index) => (
                  <div
                    key={address.addrKey || index}
                    className={`address-card ${selectedAddressIndex === index ? 'is-active' : ''}`}
                  >
                    <button 
                      className="address-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address.addrKey);
                      }}
                    >
                      삭제
                    </button>
                    <div className="address-card-content" onClick={() => handleAddressClick(address, index)}>
                      <div className="address-card-header">
                        <div className="address-name-wrapper">
                          <input
                            type="radio"
                            name="address-select"
                            checked={selectedAddressIndex === index}
                            onChange={() => handleAddressClick(address, index)}
                            className="address-radio"
                          />
                          <span className="address-name">{address.addrName || "이름 없음"}</span>
                        </div>
                        {address.addrDef === 'Y' && (
                          <span className="address-default-badge">기본배송지</span>
                        )}
                      </div>
                      <div className="address-card-body">
                        <p className="address-phone">{address.addrTel || ""}</p>
                        <p className="address-full">
                          ({address.addrZipcode || ""}) {address.addrMain || ""} {address.addrDetail || ""}
                        </p>
                        {address.addrReq && (
                          <p className="address-memo">배송 메시지: {address.addrReq}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
