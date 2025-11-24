import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    defaultAddress: null,
    addressList: [],
    orderHistory: [],
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

        setDefaultAddress(state, action) {
            state.defaultAddress = action.payload;
        },
        
        setAddressList(state, action) {
            state.addressList = action.payload;
        },

        setOrderHistory(state, action) {
            state.orderHistory = action.payload;
        },
    }
})

export const { setDefaultAddress, setAddressList, setOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;

