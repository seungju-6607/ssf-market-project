// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders, updateOrderStatus, deleteOrder } from "../../api/orders";
import { getAuth } from "../../api/auth";
import "../../styles/AdminDashboard.css";
import "../../styles/AdminOrders.css"; // 버튼/배지 등 스타일

export default function AdminOrders() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState(listOrders());
  const auth = getAuth();

  useEffect(() => {
    if (!auth || auth.role !== "admin") {
      window.location.href = "/#/login";
    }
  }, [auth, navigate]);

  const refresh = () => setOrders(listOrders());

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(
      (o) =>
        (o.buyer?.email || "").toLowerCase().includes(term) ||
        (o.buyer?.name || "").toLowerCase().includes(term) ||
        (o.product?.name || "").toLowerCase().includes(term)
    );
  }, [orders, q]);

  const formatDate = (ms) => {
    if (!ms) return "-";
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  const mark = (id, status) => {
    updateOrderStatus(id, status);
    refresh();
  };

  const remove = (id) => {
    if (window.confirm("정말로 이 주문을 완전히 삭제하시겠습니까?")) {
      deleteOrder(id);
      refresh();
    }
  };

  const showDetail = (o) => {
    // 단체주문 메타를 간단히 확인할 수 있게 팝업
    const meta = o?.meta || {};
    const lines = [
      `주문ID: ${o.id}`,
      `유형: ${o.type || "일반"}`,
      `주문일시: ${formatDate(o.createdAt)}`,
      `주문자: ${o.buyer?.name || "-"}`,
      `이메일: ${o.buyer?.email || "-"}`,
      `연락처: ${o.buyer?.phone || "-"}`,
      `업체명: ${o.buyer?.company || "-"}`,
      `요청브랜드: ${o.product?.name || "-"}`,
      `수량: ${o.qty}`,
      `필요일자: ${meta.needDate || "-"}`,
      `요청수량(희망): ${meta.wishQty ?? "-"}`,
      `메시지: ${meta.message || "-"}`,
    ];
    alert(lines.join("\n"));
  };

  if (!auth || auth.role !== "admin") return null;

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div className="admin-title">주문 관리</div>
        <div className="admin-actions">
          <Link
            className="btn"
            to={{ pathname: "/mypage", state: { activeTab: "admin-users" } }}
          >
            대시보드
          </Link>
          <Link className="btn" to="/">
            홈으로
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">주문 목록</div>
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="주문자/이메일/상품 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn" onClick={refresh}>
              새로고침
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "32px" }}>#</th>
                <th style={{ width: "120px" }}>주문일시</th>
                <th>주문자</th>
                <th>이메일</th>
                <th>상품</th>
                <th style={{ width: "80px" }}>사이즈</th>
                <th style={{ width: "70px" }}>수량</th>
                <th style={{ width: "120px" }}>금액</th>
                <th style={{ width: "100px" }}>상태</th>
                <th style={{ width: "320px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty">
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.buyer?.name || "-"}</td>
                    <td>{o.buyer?.email || "-"}</td>
                    <td>
                      {o.product?.name}
                      {o.type === "bulk" && (
                        <span className="bulk-badge" style={{
                          marginLeft: 8,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#5e37f4",
                          background: "#f3ecff",
                          border: "1px solid #e5d8ff",
                        }}>
                          단체주문
                        </span>
                      )}
                    </td>
                    <td>{o.option?.size}</td>
                    <td>{o.qty}</td>
                    <td>{o.total}원</td>
                    <td>{o.status}</td>
                    <td>
                      <div className="admin-order-btns">
                        {o.type === "bulk" && (
                          <button
                            className="admin-btn btn-outline"
                            onClick={() => showDetail(o)}
                            title="문의 상세"
                          >
                            상세
                          </button>
                        )}
                        <button
                          className="admin-btn btn-paid"
                          onClick={() => mark(o.id, "결제완료")}
                        >
                          결제완료
                        </button>
                        <button
                          className="admin-btn btn-shipping"
                          onClick={() => mark(o.id, "배송중")}
                        >
                          배송중
                        </button>
                        <button
                          className="admin-btn btn-shipping"
                          onClick={() => mark(o.id, "배송완료")}
                        >
                          배송완료
                        </button>
                        <button
                          className="admin-btn btn-cancel"
                          onClick={() => mark(o.id, "주문취소")}
                        >
                          주문취소
                        </button>
                        <button
                          className="admin-btn btn-delete"
                          onClick={() => remove(o.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
