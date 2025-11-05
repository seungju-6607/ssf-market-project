import React from "react";
import "./Membership.css";

const TIERS = [
  {
    key: "diamond",
    name: "DIAMOND",
    badge: "D",
    criteria: "3,000만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 50만G",
      "생일축하 금액권 10만원",
      "무제한 무료 AS 수선서비스",
      "매월 2매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 2매",
      "DIAMOND 기프티 연 1회",
    ],
  },
  {
    key: "platinum",
    name: "PLATINUM",
    badge: "P",
    criteria: "1,000만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 30만G",
      "생일축하 금액권 5만원",
      "구매일로부터 4년 이내 무료 AS 수선서비스",
      "매월 2매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 2매",
    ],
  },
  {
    key: "gold",
    name: "GOLD",
    badge: "G",
    criteria: "300만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 10만G",
      "생일축하 금액권 3만원",
      "구매일로부터 3년 이내 무료 AS 수선서비스",
      "매월 1매 무료반품 쿠폰",
      "VIP 전담 상담",
      "오프라인 매장 할인권 1매",
    ],
  },
  {
    key: "silver",
    name: "SILVER",
    badge: "S",
    criteria: "100만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 3만G",
      "생일축하 금액권 2만원",
      "구매일로부터 2년 이내 무료 AS 수선서비스",
      "매월 1매 무료반품 쿠폰",
      "VIP 전담 상담",
    ],
  },
  {
    key: "bronze",
    name: "BRONZE",
    badge: "B",
    criteria: "50만원 이상",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 2만G",
      "생일축하 금액권 1만원",
      "구매일로부터 1년 이내 무료 AS 수선서비스",
      "분기별 1매 무료반품 쿠폰",
    ],
  },
  {
    key: "family",
    name: "FAMILY",
    badge: "F",
    criteria: "1회 이상 구매",
    benefits: [
      "멤버십포인트적립",
      "분기별 기프트포인트 1만G",
      "생일축하 금액권 1만원",
      "구매일로부터 1년 이내 무료 AS 수선서비스",
    ],
  },
];

export default function Membership() {
  return (
    <div className="mb-wrap">
      <div className="mb-head">
        <h1>멤버십 안내</h1>
        <p className="mb-desc">
          직전 12개월(최근 1년) 구매실적을 기준으로 매월 20일 등급이 조정됩니다.
        </p>
      </div>

      <div className="mb-table-scroller">
        <table className="mb-table">
          <thead>
            <tr>
              <th className="col-title">등급</th>
              {TIERS.map((t) => (
                <th key={t.key} className="col-tier">
                  <div className={`badge ${t.key}`}>{t.badge}</div>
                  <div className="tier-name">{t.name}</div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 등급 산정 기준 */}
            <tr className="row-section">
              <td className="row-title">
                <div className="title-line">등급 산정 기준</div>
                <div className="sub">매월 20일 기준 최근 1년 구매액</div>
              </td>
              {TIERS.map((t) => (
                <td key={`${t.key}-criteria`} className="cell-ctr">
                  {t.criteria}
                </td>
              ))}
            </tr>

            {/* 혜택 목록 */}
            <tr>
              <td className="row-title big">혜택</td>
              {TIERS.map((t) => (
                <td key={`${t.key}-benefits`} className="cell-benefits">
                  <ul>
                    {t.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-notes">
        <ul>
          <li>일부 프로모션/브랜드의 경우 혜택 제공이 제한될 수 있습니다.</li>
          <li>AS/쿠폰 정책은 브랜드 및 품목에 따라 달라질 수 있습니다.</li>
          <li>등급 산정 기준 및 혜택은 사전 고지 후 변경될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
