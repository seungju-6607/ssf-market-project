import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../feature/auth/authSlice.js'
import cartSlice from '../feature/cart/cartSlice.js'
import marketReducer from "../feature/market/marketSlice.js";
import orderSlice from '../feature/order/orderSlice.js';
import paymentSlice from '../feature/payment/paymentSlice.js';

// 액션 로깅 처리 담당 미들웨어
const myLoggerMiddleware = (store) => (next) => (action) => {
  console.log("dispatch :: ", action);
  const result = next(action);
  console.log("next state :: ", store.getState());
  return result;
}

// 장바구니 상태 저장 : LocalStorage 저장
const myCartSaveMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // 장바구니(cartSlice) 경우에만 저장
  if (typeof action.type === "string" && action.type.startsWith("cart/")) {
    const cart = store.getState().cart;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return result;
}

export const store = configureStore({
  reducer: {
    "auth": authSlice,
    "cart": cartSlice,
    market: marketReducer,
    "order": orderSlice,
    "payment": paymentSlice,
  },
})