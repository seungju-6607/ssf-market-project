import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartList: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        showCartItem (state, action) {
            const { items } = action.payload;
            state.cartList = items;
        },

        //item.cartKey : 장바구니속 객체, cartKeys : 삭제할 아이템 목록
        removeCartItem (state, action) {
            const { cartKeys } = action.payload;
            state.cartList = state.cartList.filter(item => !cartKeys.includes(item.cartKey));
        }

    }
})

// Action creators are generated for each case reducer function
export const { showCartItem, removeCartItem } = cartSlice.actions

export default cartSlice.reducer //store에서 import하는 기준