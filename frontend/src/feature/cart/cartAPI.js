import { showCartItem, removeCartItem, updateCartCount, updateTotalSaleAmount } from './cartSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';

/* 장바구니 리스트 조회 */
export const showCart = () => async (dispatch) => {
    const { email } = JSON.parse(localStorage.getItem("loginUser") || "{}");
    if (!email) {
        dispatch(showCartItem({ items: [] }));
        return;
    }

    try {
        const url = "/cart/list";
        const jsonData = await axiosPost(url, { email });
        dispatch(showCartItem({ items: jsonData || [] }));
        if (jsonData.length) {
            dispatch(updateTotalSaleAmount({ "totalSaleAmount": jsonData[0].totalSaleAmount }));
        }
    } catch (error) {
        console.error("장바구니 리스트 조회 실패!!", error);
        dispatch(showCartItem({ items: [] }));
    }
}


/* 장바구니 아이템 삭제 (단일/다중) */
export const removeCart = (cartKeys) => async(dispatch) => {

    const { email } = JSON.parse(localStorage.getItem("loginUser"));

    // cartKeys가 단일 값이면 배열로 감싼다.
    const keysArray = Array.isArray(cartKeys) ? cartKeys : [cartKeys];

    // List<CartItemDto> 형식으로 변환 => 예시) [{"cartKey" : 123}, {"cartKey" : 456}]
    const cartItems = keysArray.map(key => ({ cartKey : key }));

    const url = "/cart/deleteItem";
    await axiosPost(url, cartItems);

    dispatch(removeCartItem({ cartKeys: keysArray }));
    dispatch(getCartCount(email));
    dispatch(showCart());
}


/* 장바구니 아이템 수량 (Header icon) */
export const getCartCount = (email) => async(dispatch) => {
    // 이메일이 없거나 요청 실패 시 0으로
    if (!email) {
        dispatch(updateCartCount({ "count": 0 }));
        return;
    }
    try {
        const url = "/cart/count";
        const data = {"email": email};
        const jsonData = await axiosPost(url, data);
        const sumQty = jsonData && typeof jsonData.sumQty === "number" ? jsonData.sumQty : 0;
        dispatch(updateCartCount({"count": sumQty}));
    } catch (error) {
        dispatch(updateCartCount({ "count": 0 }));
    }
}


/* 장바구니 아이템 수량 조절 (+/-) */
export const updateCartQty = (cartKey, type) => async(dispatch) => {
    const url = "/cart/updateQty";
    const data = {"cartKey": cartKey, "type": type};
    await axiosPost(url, data);  

    const { email } = JSON.parse(localStorage.getItem("loginUser") || "{}");
    dispatch(getCartCount(email));
    dispatch(showCart());
}


/* 장바구니에 담으려는 상품+사이즈가 이미 있는지 체크 */
export const checkQty = async(itemKey, size) => {
    const url = "/cart/checkQty";

    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const email = loginUser?.email;

    const data = {"itemKey": itemKey, "size": size, "email": email};
    const jsonData = await axiosPost(url, data);
    return jsonData;
}


/* 장바구니에 상품 추가 */
export const addCart = (itemKey, size) => async (dispatch) => {
    const { email } = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const checkResult = await checkQty(itemKey, size, email);
    if(!checkResult.cartKey) {
        const url = "/cart/add";
        const item = {"itemKey":itemKey, "cartSize":size, "cartQty":1, "email":email};
        await axiosPost(url, item);
        alert("상품이 추가되었습니다");
      } else {
        dispatch(updateCartQty(checkResult.cartKey, "+"));
        alert("상품이 추가되었습니다");
      }
      dispatch(getCartCount(email));
}