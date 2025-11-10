import { showCartItem, removeCartItem } from './cartSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';

/* 장바구니 리스트 조회 */
export const showCart = () => async (dispatch) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const email = loginUser?.email;
    if (!email) {
        dispatch(showCartItem({ items: [] }));
        return;
    }

    try {
        const url = "/cart/list";
        const jsonData = await axiosPost(url, { email });
        dispatch(showCartItem({ items: jsonData || [] }));
    } catch (error) {
        console.error("장바구니 리스트 조회 실패!!", error);
        dispatch(showCartItem({ items: [] }));
    }
}

/* 장바구니 아이템 삭제 (단일/다중) */
export const removeCart = (cartKeys) => async(dispatch) => {

    // cartKeys가 단일 값이면 배열로 감싼다.
    const keysArray = Array.isArray(cartKeys) ? cartKeys : [cartKeys];

    // List<CartItemDto> 형식으로 변환 => 예시) [{"cartKey" : 123}, {"cartKey" : 456}]
    const cartItems = keysArray.map(key => ({ cartKey : key }));

    const url = "/cart/deleteItem";
    await axiosPost(url, cartItems);

    dispatch(removeCartItem({ cartKeys: keysArray }));
    dispatch(showCart());
}