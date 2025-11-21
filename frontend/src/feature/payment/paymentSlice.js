import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderList: [],
}

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {

        setOrderList (state, action) {
            const { items } = action.payload;
            state.orderList = items;
        },

    }
})

export const { setOrderList } = paymentSlice.actions
export default paymentSlice.reducer;