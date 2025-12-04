import { axiosPost } from '../../utils/dataFetch.js';
import { setOrderList } from './paymentSlice.js';

export const getPayment = async (receiver, paymentInfo, cartList, total, orderSource = "cart", couponId) => {
    const { email } = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const safeList = Array.isArray(cartList) ? cartList : [];
    const isDirectOrder = orderSource === "direct";

    const cidList = isDirectOrder ? [] : safeList.map(item => item.product.id);
    const qty = safeList.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const directItems = isDirectOrder
        ? safeList.map(item => ({
            itemKey: item.product.id,
            itemPrice: parseInt(item.product.price),
            itemQty: parseInt(item.qty || 1),
            itemSize: item.size || ""
        }))
        : [];
    const firstItemName = safeList[0]?.product?.name || "주문상품";
    const url = "/payment/kakao/ready"; //카카오 OR 코드 호출
    const data = {
        "orderId": "",
        "userId": email,
        "itemName": firstItemName,
        "qty": qty,
        "totalAmount": total,
        "receiver": receiver,
        "paymentInfo": paymentInfo,
        "cidList": cidList,
        "directItems": directItems,
        "couponId": couponId,
    }

    try {
        const kakaoReadyResult = await axiosPost(url, data);
        console.log("kakaoReadyResult => ", kakaoReadyResult);
        if(kakaoReadyResult.tid) {
            //새로운 페이지 연결
            window.location.href = kakaoReadyResult.next_redirect_pc_url;
        }

    } catch(error) {
        console.log("error :: ", error);
    }

};

/* 결제 성공 시 주문 내역 노출 */
export const showOrderList = (orderId) => async (dispatch) => {
    try {
        const url = "/payment/orderList";
        const data = await axiosPost(url, { orderId: orderId });

        console.log("data is here: " + data);

        dispatch(setOrderList({ items: data || []}));
        localStorage.removeItem("cartCheckout");
        localStorage.removeItem("directCheckout");
        localStorage.removeItem("orderSource");
    } catch (error) {
        console.error("주문 내역 조회 실패!!", error);
        dispatch(setOrderList({}));
    }
};