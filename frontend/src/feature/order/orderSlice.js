import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    defaultAddress: null,
    addressList: [],
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
    }
})

export const { setDefaultAddress, setAddressList } = orderSlice.actions;
export default orderSlice.reducer;

