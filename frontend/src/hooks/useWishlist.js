const KEY = "wishlist";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};
const write = (list) => localStorage.setItem(KEY, JSON.stringify(list));

// ✅ 어디서든 똑같은 방식으로 키 생성 (id 없을 때도 고정 규칙)
export const productKey = (p = {}) => (
  (p.id ?? p.productId ?? "").toString() ||
  `${p.name || ""}::${p.image || p.img || ""}::${p.price || ""}`
);

export const isInWishlist = (p) => {
  const k = productKey(p);
  return read().some((x) => productKey(x) === k);
};

export const addWishlist = (p) => {
  const list = read();
  const k = productKey(p);
  if (!list.some((x) => productKey(x) === k)) {
    const next = [...list, { ...p, __key: k }];
    write(next);
    // 동기화 이벤트 (현재 탭에서도 받게 수동 디스패치)
    window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) }));
  }
};

export const removeWishlist = (p) => {
  const k = productKey(p);
  const next = read().filter((x) => productKey(x) !== k);
  write(next);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY, newValue: JSON.stringify(next) }));
};
