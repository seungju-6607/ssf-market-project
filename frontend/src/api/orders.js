// localStorage 기반 주문 관리 헬퍼

const STORAGE_KEY = "orders";

// 공통 저장
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// 모든 주문 목록 조회
export function listOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// 주문 상태 업데이트
export function updateOrderStatus(id, status) {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      saveOrders(orders);
    }
  } catch (e) {
    console.error("updateOrderStatus error:", e);
  }
}

// 주문 삭제
export function deleteOrder(id) {
  try {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updated = orders.filter(o => o.id !== id);
    saveOrders(updated);
  } catch (e) {
    console.error("deleteOrder error:", e);
  }
}

// ✅ 단체주문 등록 함수
export function createBulkOrder(form) {
  try {
    const orders = listOrders();

    const id = "BULK-" + Date.now(); // 고유한 주문 ID
    const qty = Number(form.quantity || 1);

    const order = {
      id,
      createdAt: Date.now(),
      type: "bulk", // 단체주문 구분값
      status: "문의접수", // 초기 상태
      buyer: {
        name: form.inquirerName || "-",
        email: form.email || "-",
        phone: form.phone || "-",
        company: form.companyName || "-",
      },
      product: {
        name: `${form.requestBrand || "브랜드"} 단체주문 (상품번호 ${form.productNo || "-"})`,
      },
      option: { size: "-" },
      qty,
      total: 0,
      meta: {
        needDate: form.needDate || "",
        wishQty: qty,
        message: form.message || "",
        agree: !!form.agree,
        __source: "bulk-order-form",
      },
    };

    orders.unshift(order);
    saveOrders(orders);
    return id;
  } catch (e) {
    console.error("createBulkOrder error:", e);
    return null;
  }
}
