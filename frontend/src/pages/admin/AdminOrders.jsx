import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAdminOrders, fetchMonthlyRevenue, fetchTotalRevenue } from "../../feature/admin/adminOrdersAPI.js";
import "../../styles/AdminDashboard.css";
import "../../styles/AdminOrders.css";

const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
};

const formatKRW = (n) => `${Number(n || 0).toLocaleString()}원`;

function RevenueLineChart({ data }) {
  const points = data || [];
  const width = 920;
  const height = 260;
  const margin = { top: 16, right: 24, bottom: 36, left: 64 };

  if (!points.length) {
    return <div className="admin-chart-empty">매출 데이터가 없습니다.</div>;
  }

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...points.map((p) => p.totalAmount), 0) || 1;
  const stepX =
    points.length > 1 ? plotWidth / (points.length - 1) : plotWidth / 2;

  const coords = points.map((p, idx) => {
    const ratio = p.totalAmount / maxValue;
    const x = margin.left + stepX * idx;
    const y = margin.top + (1 - ratio) * plotHeight;
    return { ...p, x, y };
  });

  const baseY = margin.top + plotHeight;
  const linePath = coords
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath = [
    `M ${coords[0].x} ${baseY}`,
    `L ${coords[0].x} ${coords[0].y}`,
    ...coords.slice(1).map((p) => `L ${p.x} ${p.y}`),
    `L ${coords[coords.length - 1].x} ${baseY}`,
    "Z",
  ].join(" ");

  const axisY = Array.from({ length: 5 }).map((_, idx) => {
    const ratio = idx / 4;
    const value = Math.round(maxValue * (1 - ratio));
    const y = margin.top + ratio * plotHeight;
    return { y, value };
  });

  return (
    <div className="orders-chart-shell">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="orders-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ordersChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#ff7a45" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {axisY.map((tick, idx) => (
          <g key={`y-${idx}`} className="orders-chart-gridline">
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={tick.y}
              y2={tick.y}
            />
            <text
              x={margin.left - 12}
              y={tick.y + 4}
              textAnchor="end"
              className="orders-chart-axis-label"
            >
              {formatKRW(tick.value)}
            </text>
          </g>
        ))}

        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={baseY}
          y2={baseY}
          className="orders-chart-axis"
        />

        <path d={areaPath} fill="url(#ordersChartArea)" />
        <path d={linePath} stroke="#ff6333" strokeWidth="3" fill="none" />

        {coords.map((p) => (
          <g key={p.month} className="orders-chart-point">
            <circle cx={p.x} cy={p.y} r="5" />
            <text x={p.x} y={baseY + 18} textAnchor="middle">
              {p.month}월
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const RANGE_TABS = [
  { value: "today", label: "오늘" },
  { value: "recent7", label: "최근 7일간" },
  { value: "recent4", label: "최근 4주간" },
];

export default function AdminOrders() {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const isLogin = authState?.isLogin;
  const isAdmin = (authState?.role || "").toLowerCase() === "admin";

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState({ thisYear: 0, lastYear: 0 });
  const [activeRange, setActiveRange] = useState(RANGE_TABS[2].value);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      navigate("/");
    }
  }, [isLogin, isAdmin, navigate]);

  const load = async (nextPage = page) => {
    setLoading(true);
    const orders = await fetchAdminOrders({
      page: nextPage,
      size,
      startDate,
      endDate,
    });
    setPageData(orders);

    const totalRev = await fetchTotalRevenue();
    setTotalRevenue(totalRev || { thisYear: 0, lastYear: 0 });

    const year = new Date().getFullYear();
    const rev = await fetchMonthlyRevenue(year);
    setRevenue(rev || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogin && isAdmin) {
      load(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, isAdmin]);

  const rows = pageData?.rows || [];
  const totalCount = pageData?.totalCount || 0;
  const hasNext = pageData?.hasNext || false;

  const totalSales = useMemo(() => {
    if (pageData?.summary?.totalSales) return pageData.summary.totalSales;
    return rows.reduce((sum, o) => sum + (o.orderPrice || 0), 0);
  }, [pageData, rows]);

  const previousSales = useMemo(() => {
    if (pageData?.summary?.previousSales) return pageData.summary.previousSales;
    return 0;
  }, [pageData]);

  const compareRate = useMemo(() => {
      const { thisYear = 0, lastYear = 0 } = totalRevenue;

      if(!lastYear || lastYear === 0) {
        return thisYear > 0 ? Infinity : 0;
      }

    const diff = thisYear - lastYear;
    const rate = ( diff / lastYear) * 100;

    return Number(rate.toFixed(1)); //소수점 아래 한자리로 고정 -> 숫자로 변환
  }, [totalRevenue]);

  const moveDetail = (orderId) => {
    navigate("/mypage/orders/detail", {
      state: { orderId, isAdmin: true },
    });
  };

  if (!isLogin || !isAdmin) return null;

  return (
    <div className="admin-wrap admin-orders-page">
      <div className="orders-hero">
        <div>
          <h1 className="orders-hero-title">주문 관리</h1>
        </div>
        <div className="orders-hero-metric">
          <div className="metric-label">올해 총 판매 금액</div>
          <div className="metric-value">{formatKRW(totalRevenue.thisYear)}</div>
          {compareRate !== null && (
            <div className={`metric-pill ${compareRate >= 0 ? "is-up" : "is-down"}`}>
              {compareRate >= 0 ? "▲" : "▼"} {Math.abs(compareRate)}%
            </div>
          )}
          <span className="metric-sub">이전 년도 대비</span>
        </div>
        <div className="orders-hero-actions">
          <Link className="btn btn--neutral" to="/mypage">
            마이페이지
          </Link>
          <Link className="btn" to="/">
            홈으로
          </Link>
        </div>
      </div>

      <div className="orders-tab-bar">
        <div className="orders-tab-group">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`orders-tab ${activeRange === tab.value ? "is-active" : ""}`}
              onClick={() => setActiveRange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="orders-date-picker">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              setPage(1);
              load(1);
            }}
          >
            조회
          </button>
        </div>
      </div>

      <div className="admin-card orders-panel">
        <div className="orders-panel-head">
          <div>
            <p className="panel-period">
              {startDate && endDate
                ? `${startDate} ~ ${endDate}`
                : "최근 4주간"}
            </p>
            <h2>총 주문 {totalCount}건</h2>
          </div>
          <div className="orders-panel-meta">
            <div className="meta-chip active">
              <span className="dot dot-orange" />
              최근 구간 {formatKRW(totalSales)}
            </div>
            <div className="meta-chip ghost">
              <span className="dot dot-gray" />
              이전 구간 {formatKRW(previousSales)}
            </div>
          </div>
        </div>

        <div className="orders-chart-card">
          <div className="orders-chart-title">올해 월별 매출</div>
          <RevenueLineChart data={revenue} />
        </div>

        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading">주문 목록을 불러오는 중입니다.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일시</th>
                  <th>주문자 / 수령인</th>
                  <th>주문금액</th>
                  <th style={{ width: "100px" }}>상세보기</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty">
                      주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((o) => (
                    <tr key={o.orderId}>
                      <td>{o.orderId}</td>
                      <td>{formatDateTime(o.orderedAt)}</td>
                      <td>
                        <div className="orders-people">
                          <div className="orders-person">
                            <span>주문자</span>
                            <strong>{o.ordererName || "-"}</strong>
                          </div>
                          <div className="orders-person">
                            <span>수령인</span>
                            <strong>{o.receiverName || "-"}</strong>
                          </div>
                        </div>
                      </td>
                      <td>{formatKRW(o.orderPrice)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => moveDetail(o.orderId)}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-paging">
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => {
              const next = page - 1;
              setPage(next);
              load(next);
            }}
          >
            이전
          </button>
          <span className="admin-page-info">{page}</span>
          <button
            className="btn"
            disabled={!hasNext}
            onClick={() => {
              const next = page + 1;
              setPage(next);
              load(next);
            }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
