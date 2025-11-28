import { axiosPost } from '../../utils/dataFetch.js';

const LS_KEY = "flea_market_listings_v1";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const readAll = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; } };
const writeAll = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

export const marketAPI = {
  list: async ({ q = "", category = "all", onlyAvailable = false } = {}) => {
    const all = readAll();
    console.log("all : ", all);
    let filtered = all.sort((a, b) => b.createdAt - a.createdAt);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      filtered = filtered.filter(
        (x) =>
          x.title.toLowerCase().includes(t) ||
          x.description.toLowerCase().includes(t) ||
          x.sellerName.toLowerCase().includes(t)
      );
    }
    if (category !== "all") filtered = filtered.filter((x) => x.category === category);
    if (onlyAvailable) filtered = filtered.filter((x) => x.status === "FOR_SALE");
    return filtered;
  },

  get: async (id) => readAll().find((x) => x.id === id) || null,

  create: async (payload) => {
    const now = Date.now();
    const item = {
//      id: uid(),
      title: payload.title,
      price: Number(payload.price || 0),
      images: payload.images || [],
      description: payload.description || "",
      category: payload.category || "etc",
      status: "FOR_SALE",
      sellerId: payload.sellerId,
      sellerName: payload.sellerName || "USER",
      sellerEmail: payload.sellerEmail || "",
      createdAt: now,
      updatedAt: now,
    };
    const all = readAll(); all.push(item); writeAll(all);
    console.log("확인");
    return item;
  },

  update: async (id, patch) => {
    const all = readAll();
    const idx = all.findIndex((x) => x.id === id);
    if (idx < 0) throw new Error("NOT_FOUND");
    all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() };
    writeAll(all); return all[idx];
  },

  remove: async (id, userId) => {
    const all = readAll();
    const target = all.find((x) => x.id === id);
    if (!target) throw new Error("NOT_FOUND");
    if (userId && target.sellerId !== userId) throw new Error("FORBIDDEN");
    writeAll(all.filter((x) => x.id !== id));
    return true;
  },
};

/** 판매글 등록 */
export const getCreatePost = (formData) => async (dispatch) => {
    let result = null;
    const url = "/market/add";
    result = await axiosPost(url, formData);
    return result;
}

/** 판매글 목록 가져오기 */
export const fetchListingsAPI = async (param) => {
    try {
      if (param.useListOnly) {
        const jsonData = await axiosPost("/market/list", {});
        return jsonData;
      }

      let url = "/market/list";
      let payload = {};

      const hasQuery = param.q && param.q.trim() !== '';

      if (hasQuery || param.category !== 'all' || param.onlyAvailable) {
        url = "/market/filterList";
        payload = { ...param, onlyAvailable: param.onlyAvailable ? "N" : "Y" };
      }

      const jsonData = await axiosPost(url, payload);
      return jsonData;
    } catch (error) {
      console.error("목록을 가져오는 중 오류 발생:", error);
      throw error;
    }
};

/** 판매글 상세 정보 */
export const getByFleaKey = async (fleaKey) => {
    try {
        const url = "/market/listDetail"; // 백엔드에서 fleaKey로 상세 조회 가능한 API
        const payload = { fleaKey: Number(fleaKey) };
        const result = await axiosPost(url, payload);
        return result;

      } catch (error) {
        console.error("판매글 상세 조회 실패:", error);
        throw error;
      }
}

/** 판매글 정보 수정 */
export const listUpdate = async (fleaKey, patch) => {
    try {
        const payload = {
            fleaKey : Number(fleaKey),
            category : patch.category,
            description : patch.description,
            images : patch.images,
            price : patch.price,
            sellerId : patch.sellerEmail,
            title : patch.title,
            onlyAvailable : patch.status
        }

        const url = "/market/listUpdate";
        const result = await axiosPost(url, payload);
        return result;

      } catch (error) {
        console.error("판매글 상세 조회 실패:", error);
        throw error;
      }
}

/** 판매글 삭제 */
export const listRemove = async (fleaKey) => {
    try {
        const url = "/market/listRemove";
        const payload = {fleaKey : Number(fleaKey)}
        const result = await axiosPost(url, payload);
        return result;

      } catch (error) {
        console.error("판매글 상세 조회 실패:", error);
        throw error;
      }
}