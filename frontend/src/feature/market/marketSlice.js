import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { marketAPI, getCreatePost, fetchListingsAPI, getByFleaKey, listUpdate, listRemove } from "./marketAPI.js";
import { axiosPost } from '../../utils/dataFetch.js';

const BACKEND_URL = "http://localhost:8080";

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
//  async ({ fleaKey, patch }) => await marketAPI.update(fleaKey, patch)
  async ({ fleaKey, patch }) => await listUpdate(fleaKey, patch)
);

export const deleteListing = createAsyncThunk(
  "market/deleteListing",
  async ({ fleaKey }) => {
//    await marketAPI.remove(fleaKey, userId);
    await listRemove(fleaKey);
    return fleaKey;
  }
);

export const deleteListingAndImages = createAsyncThunk(
  "market/deleteListingAndImages",
  async ({ fleaKey, imageKeys }, { dispatch, rejectWithValue }) => {
    try {
      // 1) DB 삭제
      await dispatch(deleteListing({ fleaKey })).unwrap();

      // 2) DB가 정상 삭제되면 이미지 삭제 실행
      if (imageKeys?.length) {
        const csrfToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];

        await axios.delete(`${BACKEND_URL}/market/delete`, {
          headers: { "X-XSRF-TOKEN": csrfToken },
          withCredentials: true,
          data: { keys: imageKeys },
        });
      }

      return fleaKey;
    } catch (err) {
      console.error("삭제 중 오류:", err);
      return rejectWithValue(err.message);
    }
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
      const idx = s.items.findIndex((x) => x.fleaKey  === a.payload.fleaKey );
      if (idx >= 0) s.items[idx] = a.payload;
    });
    b.addCase(deleteListing.fulfilled, (s, a) => {
      s.items = s.items.filter((x) => x.fleaKey  !== a.payload);
      if (s.current?.fleaKey  === a.payload) s.current = null;
    });
  },
});

export const { clearCurrent } = marketSlice.actions;
export default marketSlice.reducer;
