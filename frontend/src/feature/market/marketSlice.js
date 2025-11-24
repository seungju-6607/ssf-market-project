import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { marketAPI, getCreatePost, fetchListingsAPI, getByFleaKey } from "./marketAPI.js";
import { axiosPost } from '../../utils/dataFetch.js';

export const fetchListings = createAsyncThunk(
  "market/fetchListings",
//  async (params) => await marketAPI.list(params || {})
  async (params) => await fetchListingsAPI(params || {})  // API 호출 후 데이터 반환
);

export const fetchOne = createAsyncThunk(
  "market/fetchOne",
  async (fleaKey) => {
//    const item = await marketAPI.get(fleaKey);
    const item = await getByFleaKey(fleaKey);
    if (!item) throw new Error("NOT_FOUND");
    return Array.isArray(item) ? item[0] : item;
  }
);

export const createListing = createAsyncThunk(
  "market/createListing",
//  async (payload) => await marketAPI.create(payload)
  async (payload) => {
    const res = await axiosPost("/market/add", payload);
    return res; // 서버에서 반환한 새 게시글
  }
);

export const updateListing = createAsyncThunk(
  "market/updateListing",
  async ({ id, patch }) => await marketAPI.update(id, patch)
);

export const deleteListing = createAsyncThunk(
  "market/deleteListing",
  async ({ id, userId }) => {
    await marketAPI.remove(id, userId);
    return id;
  }
);

const marketSlice = createSlice({
  name: "market",
  initialState: { items: [], current: null, loading: false, error: null },
  reducers: { clearCurrent(state) { state.current = null; state.error = null; } },
  extraReducers: (b) => {
    b.addCase(fetchListings.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchListings.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
     .addCase(fetchListings.rejected, (s, a) => { s.loading = false; s.error = a.error?.message || "목록 실패"; });

    b.addCase(fetchOne.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchOne.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
//        console.log("Updated items:", s);
     })
     .addCase(fetchOne.rejected, (s, a) => { s.loading = false; s.error = a.error?.message || "상세 실패"; });

    b.addCase(createListing.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(updateListing.fulfilled, (s, a) => {
      s.current = a.payload;
      const idx = s.items.findIndex((x) => x.id === a.payload.id);
      if (idx >= 0) s.items[idx] = a.payload;
    });
    b.addCase(deleteListing.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.id !== a.payload);
      if (s.current?.id === a.payload) s.current = null;
    });
  },
});

export const { clearCurrent } = marketSlice.actions;
export default marketSlice.reducer;
