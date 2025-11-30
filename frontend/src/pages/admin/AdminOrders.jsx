import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAdminOrders, fetchMonthlyRevenue, fetchTotalRevenue } from "../../feature/admin/adminOrdersAPI.js";
import "../../styles/AdminOrders.css";
import "../../styles/AdminDashboard.css";

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

const formatOrderStatus = (status) => {
  if (status === 'C') return '주문취소';
  return '주문완료';
};

function RevenueLineChart({ data }) {
  const points = data || [];
  const width = 920;
  const height = 260;
  const margin = { top: 16, right: 24, bottom: 36, left: 80 };
  const [tooltip, setTooltip] = useState(null);

  if (!points.length) {
    return <div className="admin-chart-empty">매출 데이터가 없습니다.</div>;
  }

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  
  // 그래프의 최대값 구함함
  const dataMax = Math.max(...points.map((p) => p.totalAmount), 0) || 1;
  
  const getRoundedMax = (value) => {
    if (value <= 0) return 1000000;
    // 100만 단위로 올림
    const roundedToMillion = Math.ceil(value / 1000000) * 1000000;
    // 50만 단위로 올림
    const roundedToHalfMillion = Math.ceil(value / 500000) * 500000;
    // 더 작은 값을 선택
    return roundedToHalfMillion < roundedToMillion ? roundedToHalfMillion : roundedToMillion;
  };
  
  const maxValue = getRoundedMax(dataMax);
  const minValue = 0; // y축은 0부터 시작
  const valueRange = maxValue - minValue || 1;
  
  // stepSize 결정: 50만 또는 100만 단위
  const stepSize = maxValue <= 5000000 ? 500000 : 1000000;
  
  const stepX =
    points.length > 1 ? plotWidth / (points.length - 1) : plotWidth / 2;

  const coords = points.map((p, idx) => {
    const ratio = (p.totalAmount - minValue) / valueRange;
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

  // Y축 눈금을 stepSize 단위로 생성
  const axisY = [];
  for (let value = minValue; value <= maxValue; value += stepSize) {
    const ratio = (value - minValue) / valueRange;
    const y = margin.top + (1 - ratio) * plotHeight;
    axisY.push({ y, value });
  }

  return (
    <div className="orders-chart-shell">
      <svg
        viewBox={`0 0 ${width + 20} ${height}`}
        className="orders-chart"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ordersChartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E9D7FF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#E9D7FF" stopOpacity="0.06" />
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
              x={margin.left - 8}
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
        <path d={linePath} stroke="#E9D7FF" strokeWidth="3" fill="none" />

        {coords.map((p) => (
          <g key={p.month} className="orders-chart-point">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="5"
              onMouseEnter={(e) => {
                setTooltip({
                  value: p.totalAmount,
                  month: p.month,
                });
              }}
              onMouseMove={(e) => {
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  value: p.totalAmount,
                  month: p.month,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
            <text x={p.x} y={baseY + 18} textAnchor="middle">
              {p.month}월
            </text>
          </g>
        ))}
      </svg>
      {tooltip && tooltip.x !== undefined && (
        <div
          className="orders-chart-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 10}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-month">{tooltip.month}월</div>
            <div className="tooltip-value">{formatKRW(tooltip.value)}</div>
          </div>
        </div>
      )}
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
  const [previousSales, setPreviousSales] = useState(0);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      navigate("/");
    }
  }, [isLogin, isAdmin, navigate]);

  const load = async (nextPage = page, s = startDate, e = endDate) => {
    setLoading(true);

    const orders = await fetchAdminOrders({
      page: nextPage,
      size,
      startDate: s,
      endDate: e,
    });
    setPageData(orders);


    if (!startDate || !endDate) {
        setPreviousSales(orders?.summary?.previousSales || 0);
        } else {
        const prevRange = getPreviousRange(s, e);
        if (prevRange) {
          const prevData = await fetchAdminOrders({
            page: 1,
            size: 9999,
            startDate: prevRange.prevStart,
            endDate: prevRange.prevEnd,
          });
          const prevRows = prevData?.rows || [];
          const sum = prevRows.reduce(
            (total, o) => total + (o.orderPrice || 0),
            0
          );
          setPreviousSales(sum);
        } else {
          setPreviousSales(0);
        }
    }

    const totalRev = await fetchTotalRevenue();
    setTotalRevenue(totalRev || { thisYear: 0, lastYear: 0 });

    const year = new Date().getFullYear();
    const rev = await fetchMonthlyRevenue(year);
    setRevenue(rev || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogin && isAdmin) {
      const { startDate: s, endDate: e } = getPresetRange("recent4");
      setStartDate(s);
      setEndDate(e);
      setPage(1);
      load(1, s, e);
    }
  }, [isLogin, isAdmin]);

  const rows = pageData?.rows || [];
  const totalCount = pageData?.totalCount || 0;
  const hasNext = pageData?.hasNext || false;
  const totalPages = Math.ceil(totalCount / size);

  // 탭 값에 따라 날짜 범위 계산
  const getPresetRange = (value) => {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);

    if (value === "today") {
      // 오늘 하루
    } else if (value === "recent7") {
      // 최근 7일: 오늘 포함 7일
      start.setDate(start.getDate() - 6);
    } else if (value === "recent4") {
      // 최근 4주: 대략 28일로
      start.setDate(start.getDate() - 27);
    }

    const fmt = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD

    return {
      startDate: fmt(start),
      endDate: fmt(end),
    };
  };

  //최근 구간과 동일한 기간의 이전 구간 날짜를 계산
  const getPreviousRange = (start, end) => {
    if(!start || !end) return null;

    const s = new Date(start);
    const e = new Date(end);

    const diffDays = Math.floor((e-s) / (1000 * 60 * 60 * 24)) +1 //일수 계산
    const prevEnd = new Date(s);
    prevEnd.setDate(prevEnd.getDate() -1);

    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - (diffDays -1));  //길이 맞춰서 시작일 계산

    return {
        prevStart: prevStart.toISOString().slice(0, 10),
        prevEnd: prevEnd.toISOString().slice(0, 10),
    };
  };

  const totalSales = useMemo(() => {
    if (pageData?.summary?.totalSales) return pageData.summary.totalSales;
    return rows.reduce((sum, o) => sum + (o.orderPrice || 0), 0);
  }, [pageData, rows]);

  const compareRate = useMemo(() => {

    const { thisYear, lastYear } = totalRevenue;
    const diff = thisYear - lastYear;
    const rate = ( diff / lastYear) * 100;
    const cappedRate = Math.min(rate, 999);

    return Number(cappedRate.toFixed(1)); //소수점 아래 한자리로 고정 -> 숫자로 변환
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
          <Link className="btn btn--neutral admin-order-btn" to="/mypage">
            마이페이지
          </Link>
          <Link className="btn admin-order-btn" to="/">
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
              onClick={() => {
                 setActiveRange(tab.value);

                 // 탭에 맞는 날짜 범위 계산
                 const { startDate: s, endDate: e } = getPresetRange(tab.value);
                 setStartDate(s);
                 setEndDate(e);

                 // 1페이지부터 다시 조회
                 setPage(1);
                 load(1, s, e);
               }}
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
                  <th>상태</th>
                  <th style={{ width: "100px" }}>상세보기</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty">
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
                        <span className={o.orderStatus === 'C' ? 'order-status-cancelled' : ''}>
                          {formatOrderStatus(o.orderStatus)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn admin-order-btn"
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
            className="btn admin-order-btn admin-paging-prev"
            onClick={() => {
              if (page > 1) {
                const next = page - 1;
                setPage(next);
                load(next);
              }
            }}
            disabled={page <= 1}
            style={{ visibility: page > 1 ? 'visible' : 'hidden' }}
          >
            이전
          </button>
          <div className="admin-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`btn admin-order-btn ${page === pageNum ? "is-active" : ""}`}
                onClick={() => {
                  setPage(pageNum);
                  load(pageNum);
                }}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            className="btn admin-order-btn admin-paging-next"
            onClick={() => {
              if (page < totalPages) {
                const next = page + 1;
                setPage(next);
                load(next);
              }
            }}
            disabled={page >= totalPages}
            style={{ visibility: page < totalPages ? 'visible' : 'hidden' }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
