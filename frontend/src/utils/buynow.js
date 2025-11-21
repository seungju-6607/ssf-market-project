// src/utils/buynow.js

const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

/**
 * @param {object} rawItem - 브랜드/상품 카드에서 넘겨주는 상품 데이터
 * @param {number} quantity - 수량 
 */
export function buyNow(rawItem, quantity = 1) {
  if (!rawItem) {
    console.warn("buyNow: rawItem 이 없습니다.");
    return;
  }

  const qty = Number(quantity || rawItem.qty || 1);
  const product = {
    id:
      rawItem.id ??
      rawItem.productId ??
      rawItem.code ??
      (rawItem.product && (rawItem.product.id || rawItem.product.code)) ??
      `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: rawItem.name || rawItem.title || (rawItem.product && rawItem.product.name) || "상품명",
    image:
      rawItem.image ||
      rawItem.img ||
      rawItem.src ||
      (rawItem.product &&
        (rawItem.product.image || rawItem.product.img || rawItem.product.src)) ||
      "",
    price: toNumber(
      rawItem.price ??
        (rawItem.product && rawItem.product.price) ??
        0
    ),
  };

  const payload = {
    product,
    size: rawItem.size || rawItem.option?.size || "",
    qty,
  };

  try {
    localStorage.setItem("pendingOrder", JSON.stringify(payload));
    localStorage.setItem("lastProduct", JSON.stringify(product));
  } catch (e) {
    console.error("buyNow: localStorage 저장 실패", e);
  }

  window.location.href = "/checkout";
}
