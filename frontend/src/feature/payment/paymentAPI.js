// src/feature/payment/paymentAPI.js
import { axiosPost } from "../../utils/dataFetch.js";
import { setOrderList } from "./paymentSlice.js";

/**
 * ✅ 카카오페이 결제 준비 요청
 * - userEmail을 외부(Checkout)에서 강제로 받아서 userId를 고정 (anonymousUser 방지)
 */
export const getPayment = async (
  receiver,
  paymentInfo,
  cartList,
  total,
  orderSource = "cart",
  couponId,
  userEmail // ✅ 추가
) => {
  // ✅ 1) userEmail 우선, 없으면 localStorage에서 보조로 읽기
  const stored = (() => {
    try {
      return JSON.parse(localStorage.getItem("loginUser") || "{}");
    } catch {
      return {};
    }
  })();

  const email = userEmail || stored.email || "";

  // ✅ 2) 로그인 안 된 상태면 결제 호출 자체를 막음
  if (!email) {
    console.error("[getPayment] login email missing. stop payment.");
    alert("로그인 후 결제할 수 있어요.");
    return;
  }

  const safeList = Array.isArray(cartList) ? cartList : [];
  if (safeList.length === 0) {
    console.error("[getPayment] cartList empty. stop payment.");
    alert("결제할 상품이 없습니다.");
    return;
  }

  const isDirectOrder = orderSource === "direct";

  const cidList = isDirectOrder ? [] : safeList.map((item) => item.product.id);

  const qty = safeList.reduce((sum, item) => sum + parseInt(item.qty || 1, 10), 0);

  const directItems = isDirectOrder
    ? safeList.map((item) => ({
        itemKey: item.product.id,
        itemPrice: parseInt(item.product.price || 0, 10),
        itemQty: parseInt(item.qty || 1, 10),
        itemSize: item.size || "",
      }))
    : [];

  const firstItemName = safeList[0]?.product?.name || "주문상품";

  const url = "/payment/kakao/ready";

  const data = {
    orderId: "",
    userId: email, // ✅ 핵심: 무조건 이메일로 고정
    itemName: firstItemName,
    qty,
    totalAmount: total, // 숫자(273600) 형태로 들어가야 함
    receiver,
    paymentInfo,
    cidList,
    directItems,
    couponId,
  };

  try {
    const kakaoReadyResult = await axiosPost(url, data);
    console.log("kakaoReadyResult => ", kakaoReadyResult);

    if (kakaoReadyResult?.tid && kakaoReadyResult?.next_redirect_pc_url) {
      window.location.href = kakaoReadyResult.next_redirect_pc_url;
    } else {
      console.error("[getPayment] invalid kakaoReadyResult:", kakaoReadyResult);
      alert("결제 준비에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  } catch (error) {
    console.log("error :: ", error);
    alert("결제 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

/* ✅ 결제 성공 시 주문 내역 노출 */
export const showOrderList = (orderId) => async (dispatch) => {
  try {
    // ⚠️ 여기 URL이 이상함:
    // 지금은 Vercel로 POST 때리는데, 주문조회는 백엔드(Render)로 가야 정상임.
    // 일단 네 기존 코드 유지하되, 아래 주석대로 고치는 걸 권장.
    //
    // const url = "/payment/orderList";  // ✅ 보통은 이렇게 백엔드로
    // const data = await axiosPost(url, { orderId });

    const url = "https://ssf-market-project.vercel.app/kakao-callback";
    const data = await axiosPost(url, { orderId });

    dispatch(setOrderList({ items: data || [] }));

    localStorage.removeItem("cartCheckout");
    localStorage.removeItem("directCheckout");
    localStorage.removeItem("orderSource");
  } catch (error) {
    console.error("주문 내역 조회 실패!!", error);
    dispatch(setOrderList({}));
  }
};
