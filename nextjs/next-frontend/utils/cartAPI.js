import React from 'react';
// import { addCartItem, updateCartCount,
//          showCartItem, updateTotalPrice,
//          updateCartItem, removeCartItem } from './cartSlice.js';
import { axiosData, axiosPost } from '@/utils/dataFetch.js';
import { useAuthStore } from "@/store/authStore.js";

export const showCart = async(userId) =>  {
    // const url = "/cart/list";
    // const { userId } = JSON.parse(localStorage.getItem("loginInfo"));
    console.log("showCart userId ----------------> ", userId);
    const jsonData = await axiosPost("/cart/list", {"id": userId});
    // dispatch(showCartItem({"items": jsonData}));
    // jsonData.length && dispatch(updateTotalPrice({"totalPrice" : jsonData[0].totalPrice}));
    return jsonData;
}
//
export const getCartCount = async (id) => {
    const url = "/cart/count";
    const data = {"id": id};
    const jsonData = await axiosPost(url, data);
    console.log("🎯 getCartCount", jsonData, jsonData.sumQty);
    return jsonData;
    // dispatch(updateCartCount({"count": jsonData.sumQty}));
}

export const removeCart = async(cid) =>  {
    const url = "/cart/deleteItem";
    const data = {"cid": cid};
    const rows = await axiosPost(url, data);
    return rows;
}



export const updateCart = async(cid, type, userId) => {
    const url = "/cart/updateQty";
    const data = {"cid": cid, "type": type};
    const rows = await axiosPost(url, data);
    return rows;
}

export const checkQty = async(pid, size, id) => {
    const url = "/cart/checkQty";
    const data = {"pid": pid, "size": size, "id": id};
    const jsonData = await axiosPost(url, data);
    return jsonData;
}

export const addCart = async(pid, size, userId)=> {
    // console.log("addCart :: ", pid, size, userId);
    // const { userId } = JSON.parse(localStorage.getItem("loginInfo"));
    const checkResult = await checkQty(pid, size, userId);
console.log("checkResult :: ",checkResult);
    if(!checkResult.checkQty) {
        const url = "/cart/add";
        const item = {"pid":pid, "size":size, "qty":1, "id": userId};
        const rows = await axiosPost(url, item);
        const data = await getCartCount(userId);
        useAuthStore.getState().setCartCount(data.sumQty ?? 0);
        // alert("상품이 추가되었습니다");
      } else {
       const rows = await updateCart(checkResult.cid, "+", userId);
        const data = await getCartCount(userId);
        console.log("🎯 addCart -- data.sumQty", data.sumQty);
        // setCartCount(data.sumQty ?? 0);   // ✅ 여기!
        useAuthStore.getState().setCartCount(data.sumQty ?? 0);
          // const rows = dispatch(updateCart(checkResult.cid, "+"));
        // alert("상품이 추가되었습니다");
      }
      // dispatch(getCartCount(userId));
}

