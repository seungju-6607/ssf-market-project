import { axiosPost } from "../../utils/dataFetch.js";
import { setOrderList } from "./paymentSlice.js";

const safeParse = (v, fallback) => {
  try {
    const x = JSON.parse(v);
    return x ?? fallback;
  } catch {
    return fallback;
  }
};

export const getPayment = async (
  receiver,
  paymentInfo,
  cartList,
  total,
  orderSource = "cart",
  couponId
) => {
  // ✅ email 강제 확보
  const loginUser = safeParse(localStorage.getItem("loginUser") || "{}", {});
  const email = loginUser?.email || "";

  if (!email) {
    alert("로그인 후 결제할 수 있어요.");
    console.error("[PAY] loginUser.email missing", loginUser);
    return;
  }

  const safeList = Array.isArray(cartList) ? cartList : [];
  if (safeList.length === 0) {
    alert("결제할 상품이 없습니다.");
    return;
  }

  // ✅ orderId 무조건 생성해서 보냄 (빈값 절대 X)
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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

  const data = {
    orderId,                 // ✅ 항상 채워짐
    userId: email,           // ✅ 항상 email
    itemName: firstItemName,
    qty,
    totalAmount: total,
    receiver,
    paymentInfo,
    cidList,
    directItems,
    couponId,
  };

  console.log("[PAY READY PAYLOAD]", data);

  try {
    const kakaoReadyResult = await axiosPost("/payment/kakao/ready", data);
    console.log("kakaoReadyResult => ", kakaoReadyResult);

    if (kakaoReadyResult?.next_redirect_pc_url) {
      window.location.href = kakaoReadyResult.next_redirect_pc_url;
      return;
    }

    alert("결제 준비 실패: 응답값이 올바르지 않습니다.");
    console.error("[PAY] invalid ready response", kakaoReadyResult);
  } catch (error) {
    console.log("error :: ", error);
    alert("결제 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

/* 결제 성공 시 주문 내역 노출 */
export const showOrderList = (orderId) => async (dispatch) => {
  try {
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
