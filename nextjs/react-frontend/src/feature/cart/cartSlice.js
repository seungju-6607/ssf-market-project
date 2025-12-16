import { createSlice } from '@reduxjs/toolkit'
import { cartItemsCheck, cartItemsAddInfo } from '../../utils/cart.js';

const saveCart = JSON.parse(localStorage.getItem("cart"));

const initialState = saveCart || {
  cartCount: 0,
  cartList: [],
  totalPrice: 0,
  cidList : []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCartItem (state, action) {
        const { cartItem } = action.payload;
        state.cartList = cartItemsCheck(state.cartList, cartItem); 
    },
    showCartItem (state, action) {
        const { items } = action.payload;
        state.cartList = items;
        state.cidList = items.map(item => item.cid);
    },
    updateCartCount (state, action) {
        const { count } = action.payload;
        state.cartCount = count;

        //새로고침을 위한 데이터 복사(localStorage 저장)
        localStorage.setItem("cart",
                            JSON.stringify({
                                "cartCount": count
                            })
        )
    },
    resetCartCount(state){
        state.cartCount = 0;
    },
    updateTotalPrice (state, action) {
        state.totalPrice = action.payload.totalPrice;
    },
    updateCartItem (state, action) {
        const { cid, type } = action.payload;
        state.cartList = state.cartList.map((item) => 
                item.cid === cid ?
                    type === '+'? {...item, qty: item.qty+1}   
                                : item.qty > 1 ? {...item, qty: item.qty-1} : item
                :   item  
                );
    },
    removeCartItem (state, action) {
        const { cid } = action.payload;
        state.cartList = state.cartList.filter(item => !(item.cid === cid));
    }
  },
})

export const {  addCartItem, updateCartCount, showCartItem, updateTotalPrice,
                updateCartItem, removeCartItem, resetCartCount
             } = cartSlice.actions   //API 함수 또는 컴포넌트에서 dispatch(액션함수)

export default cartSlice.reducer  //store  import