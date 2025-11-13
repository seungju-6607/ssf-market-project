import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartCount: null,
    cartList: [],
    totalSaleAmount: 0,
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
        },

        updateCartCount (state, action) {
            state.cartCount = action.payload.count;
        },

        updateTotalSaleAmount (state, action) {
            state.totalSaleAmount = action.payload.totalSaleAmount;
        },

        resetCartCount (state) {
            state.cartCount = null;
        }

    }
})

// Action creators are generated for each case reducer function
export const { showCartItem, removeCartItem, updateCartCount, updateTotalSaleAmount, resetCartCount } = cartSlice.actions

export default cartSlice.reducer //store에서 import하는 기준