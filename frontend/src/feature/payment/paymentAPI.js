import { axiosPost } from "../../utils/dataFetch.js";
import { setOrderList } from "./paymentSlice.js";

/**
 * ✅ userEmail(필수) 을 파라미터로 받아서
 * payload.userId가 절대 anonymousUser로 안가게 만든 버전
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
  const safeList = Array.isArray(cartList) ? cartList : [];
  const isDirectOrder = orderSource === "direct";

  // ✅ userId 고정 (anonymousUser 차단)
  const email = userEmail || JSON.parse(localStorage.getItem("loginUser") || "{}")?.email;

  if (!email) {
    alert("로그인 정보(email)가 없습니다. 다시 로그인 후 시도해 주세요.");
    return;
  }

  const cidList = isDirectOrder ? [] : safeList.map((item) => item.product.id);

  const qty = safeList.reduce((sum, item) => sum + parseInt(item.qty || 1, 10), 0);

  const directItems = isDirectOrder
    ? safeList.map((item) => ({
        itemKey: item.product.id,
        itemPrice: parseInt(item.product.price, 10),
        itemQty: parseInt(item.qty || 1, 10),
        itemSize: item.size || "",
      }))
    : [];

  const firstItemName = safeList[0]?.product?.name || "주문상품";

  const url = "/payment/kakao/ready";

  // ✅ orderId는 백엔드에서 만들든 프론트에서 만들든 상관없는데,
  // 네 백엔드가 프론트 orderId를 쓰는 구조면 여기서 만들어 보내도 됨.
  // (일단 너 스샷처럼 ORD-... 만들어 보내는 구조로 유지)
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const data = {
    orderId,
    userId: email,              // ✅ 핵심: 여기!
    itemName: firstItemName,
    qty,
    totalAmount: total,
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
      return;
    }

    alert("결제 준비 응답이 이상합니다. (next_redirect_pc_url 없음)");
  } catch (error) {
    console.log("error :: ", error);
    alert("결제 준비 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
};

/* 결제 성공 시 주문 내역 노출 */
export const showOrderList = (orderId) => async (dispatch) => {
  try {
    // ✅ 여기가 기존에 Vercel로 박혀있어서(https://ssf-market-project.vercel.app/kakao-callback)
    // 백엔드가 아니라 프론트를 때리게 됨.
    // 너 백엔드 컨트롤러에 맞는 엔드포인트로 바꿔야 함.
    // 보통은 /payment/orderList 같은 형태로 백엔드에 만들었을 확률이 높아서 이렇게 둠.
    const url = "/payment/orderList"; // ⚠️ 네 백엔드 실제 경로에 맞게 1줄만 수정하면 됨.

    const data = await axiosPost(url, { orderId });

    dispatch(setOrderList({ items: data || [] }));
    localStorage.removeItem("cartCheckout");
    localStorage.removeItem("directCheckout");
    localStorage.removeItem("orderSource");
  } catch (error) {
    console.error("주문 내역 조회 실패!!", error);
    dispatch(setOrderList({ items: [] }));
  }
};
