// src/hooks/useWishlist.js
import axiosJWT from "../api/axiosJWT.js";

const LOCAL_KEY = "wishlist";

/* =========================
 * 로컬 스토리지 유틸
 * ========================= */
const readLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
  } catch {
    return [];
  }
};

const writeLocal = (list) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

/* =========================
 * 공통 유틸
 * ========================= */
export const productKey = (p) =>
  `${p?.productId ?? p?.id ?? p?.code ?? p?.pid ?? "unknown"}`;

const toNumber = (v) =>
  typeof v === "number"
    ? v
    : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

/* =========================
 * 서버 → 로컬 동기화
 * ========================= */
export const syncWishlistFromServer = async (email) => {
  if (!email) return readLocal();

  try {
    const res = await axiosJWT.get(
      `/wishlist/list?email=${encodeURIComponent(email)}`
    );
    const list = Array.isArray(res.data) ? res.data : [];
    writeLocal(list);
    return list;
  } catch (err) {
    console.error("wishlist/list 오류:", err);
    return readLocal();
  }
};

/* =========================
 * 찜 토글 (서버 + 로컬 즉시 반영)
 * ========================= */
export const toggleWishlistServer = async (email, rawProduct) => {
  if (!email) {
    alert("로그인 후 찜 기능을 이용해 주세요.");
    return readLocal();
  }

  const dto = {
    email,
    productId: productKey(rawProduct),
    productName: rawProduct.productName ?? rawProduct.name ?? "상품명",
    productBrand:
      rawProduct.productBrand ??
      rawProduct.brand ??
      rawProduct.brandName ??
      "",
    productImage:
      rawProduct.productImage ??
      rawProduct.image ??
      rawProduct.img ??
      "",
    productPrice: toNumber(rawProduct.productPrice ?? rawProduct.price),
    productPriceOri: toNumber(
      rawProduct.productPriceOri ??
        rawProduct.priceOri ??
        rawProduct.originalPrice ??
        rawProduct.price
    ),
  };

  try {
    const res = await axiosJWT.post("/wishlist/toggle", dto);

    const on =
      typeof res?.data === "boolean"
        ? res.data
        : (!!res?.data?.on ?? !!res?.data?.liked);

    const current = readLocal();
    const exists = current.some((it) => it.productId === dto.productId);

    let next;
    if (on) {
      if (exists) {
        next = current.map((it) =>
          it.productId === dto.productId ? { ...it, ...dto } : it
        );
      } else {
        next = [...current, dto];
      }
    } else {
      next = current.filter((it) => it.productId !== dto.productId);
    }

    writeLocal(next);
    return on;
  } catch (err) {
    console.error("wishlist/toggle 오류:", err);
    const list = readLocal();
    return list.some((it) => it.productId === dto.productId);
  }
};

/* =========================
 * 찜 전체 삭제
 * ========================= */
export const clearWishlistOnServer = async (email) => {
  if (!email) return readLocal();

  try {
    await axiosJWT.post("/wishlist/clear", { email });
    writeLocal([]);
    return [];
  } catch (err) {
    console.error("wishlist/clear 오류:", err);
    return readLocal();
  }
};

/* =========================
 * 로컬 체크 유틸
 * ========================= */
export const isInWishlist = (product) => {
  const key = productKey(product);
  const list = readLocal();
  return list.some((it) => it.productId === key);
};

export const getWishlistCount = () => readLocal().length;
