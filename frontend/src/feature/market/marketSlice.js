import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { marketAPI } from "./marketAPI.js";

export const fetchListings = createAsyncThunk(
  "market/fetchListings",
  async (params) => await marketAPI.list(params || {})
);

export const fetchOne = createAsyncThunk(
  "market/fetchOne",
  async (id) => {
    const item = await marketAPI.get(id);
    if (!item) throw new Error("NOT_FOUND");
    return item;
  }
);

export const createListing = createAsyncThunk(
  "market/createListing",
  async (payload) => await marketAPI.create(payload)
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
     .addCase(fetchOne.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
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
