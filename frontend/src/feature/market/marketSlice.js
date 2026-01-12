import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchListingsAPI,
  getByFleaKey,
  listUpdate,
  listRemove,
} from "./marketAPI.js";
import { axiosPost } from "../../utils/dataFetch.js";
import axiosJWT from "../../api/axiosJWT.js";

/* =========================
 * 목록 조회
 * ========================= */
export const fetchListings = createAsyncThunk(
  "market/fetchListings",
  async (params) => {
    return await fetchListingsAPI(params || {});
  }
);

/* =========================
 * 단건 조회
 * ========================= */
export const fetchOne = createAsyncThunk(
  "market/fetchOne",
  async (fleaKey) => {
    const item = await getByFleaKey(fleaKey);
    if (!item) throw new Error("NOT_FOUND");
    return Array.isArray(item) ? item[0] : item;
  }
);

/* =========================
 * 등록
 * ========================= */
export const createListing = createAsyncThunk(
  "market/createListing",
  async (payload) => {
    const res = await axiosPost("/market/add", payload);
    return res;
  }
);

/* =========================
 * 수정
 * ========================= */
export const updateListing = createAsyncThunk(
  "market/updateListing",
  async ({ fleaKey, patch }) => {
    return await listUpdate(fleaKey, patch);
  }
);

/* =========================
 * 삭제 (DB)
 * ========================= */
export const deleteListing = createAsyncThunk(
  "market/deleteListing",
  async ({ fleaKey }) => {
    await listRemove(fleaKey);
    return fleaKey;
  }
);

/* =========================
 * 삭제 (DB + 이미지)
 * ========================= */
export const deleteListingAndImages = createAsyncThunk(
  "market/deleteListingAndImages",
  async ({ fleaKey, imageKeys }, { dispatch, rejectWithValue }) => {
    try {
      // 1️⃣ 게시글 DB 삭제
      await dispatch(deleteListing({ fleaKey })).unwrap();

      // 2️⃣ 이미지 삭제 (JWT)
      if (imageKeys?.length) {
        await axiosJWT.delete("/market/delete", {
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

/* =========================
 * Slice
 * ========================= */
const marketSlice = createSlice({
  name: "market",
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* 목록 */
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "목록 실패";
      })

      /* 단건 */
      .addCase(fetchOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOne.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "상세 실패";
      })

      /* 생성 */
      .addCase(createListing.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      /* 수정 */
      .addCase(updateListing.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.items.findIndex(
          (x) => x.fleaKey === action.payload.fleaKey
        );
        if (idx >= 0) state.items[idx] = action.payload;
      })

      /* 삭제 */
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (x) => x.fleaKey !== action.payload
        );
        if (state.current?.fleaKey === action.payload) {
          state.current = null;
        }
      });
  },
});

export const { clearCurrent } = marketSlice.actions;
export default marketSlice.reducer;
