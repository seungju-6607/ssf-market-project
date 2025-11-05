// src/components/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import EmailPolicyModal from "./EmailPolicyModal";

// Footer 링크 데이터 - 3개 그룹으로 분리
const footerLinksLeft = [
  { text: "회사소개", to: "/company" },
  { text: "이용약관", to: "/terms" },
  { text: "개인정보 처리방침", to: "/privacy", strong: true },
  // 이 항목은 페이지 이동 대신 모달로 처리
  { text: "이메일무단수집거부", to: "/email-policy", modal: "emailPolicy" },
];

const footerLinksCenter = [
  { text: "멤버십안내", to: "/membership" },
  { text: "고객센터", to: "/help" },
  { text: "매장찾기", to: "/stores" },
  { text: "공지사항", to: "/notice" },
  { text: "단체주문", to: "/bulk-order" },
];

const footerLinksRight = [
  { text: "입점신청", to: "/store-application" },
  { text: "제휴문의", to: "/partnership" },
];

// 회사 정보 데이터
const companyInfo = {
  name: "삼성물산(주)패션부문",
  address: "서울특별시 강남구 남부순환로 2806(도곡동)",
  ceo: "오세철 외 2명",
  businessNumber: "101-85-43600",
  ecommerceNumber: "제 2015-서울강남-02894",
  hosting: "삼성물산(주)패션부문",
  escrow: "KG모빌리언스 구매안전(에스크로)서비스",
  escrowLink: "서비스 가입사실 확인",
  escrowDesc:
    "고객님의 안전거래를 위해 현금 등으로 5만원 이상 결제 시 저희 쇼핑몰에서 가입한 구매안전(에스크로) 서비스를 이용하실 수 있습니다.",
  phone: "1599-0007(전국) 080-700-1472(수신자부담)",
  email: "ssfshop@samsung.com",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showEmailModal, setShowEmailModal] = useState(false);

  // 공통 렌더 함수: 모달 항목이면 a태그 + onClick으로 처리
  const renderFooterLink = (link, index) => {
    const className = link.strong ? "strong" : "";

    if (link.modal === "emailPolicy") {
      return (
        <a
          key={index}
          href="/#/email-policy"
          className={className}
          onClick={(e) => {
            e.preventDefault(); // 라우팅 막고
            setShowEmailModal(true); // 모달 오픈
          }}
        >
          {link.text}
        </a>
      );
    }

    return (
      <Link key={index} to={link.to} className={className}>
        {link.text}
      </Link>
    );
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Footer 링크 영역 */}
        <div className="footer-top">
          <div className="footer-links-wrapper">
            {/* 왼쪽 그룹 */}
            <div className="footer-links-group">
              {footerLinksLeft.map(renderFooterLink)}
            </div>

            {/* 세로 구분선 */}
            <div className="footer-divider"></div>

            {/* 중앙 그룹 */}
            <div className="footer-links-group">
              {footerLinksCenter.map(renderFooterLink)}
            </div>

            {/* 오른쪽 그룹 */}
            <div className="footer-links-group footer-links-right">
              {footerLinksRight.map(renderFooterLink)}
            </div>
          </div>
        </div>

        {/* 회사 정보 영역 */}
        <div className="footer-content">
          <div className="company-info">
            <h3>{companyInfo.name}</h3>
            <p>
              주소: {companyInfo.address} ㅣ 대표 : {companyInfo.ceo} ㅣ
              사업자 등록번호: {companyInfo.businessNumber}{" "}
              <a href="#" className="info-link">
                사업자정보확인
              </a>{" "}
              ㅣ 통신판매업 신고번호: {companyInfo.ecommerceNumber} ㅣ 호스팅서비스:{" "}
              {companyInfo.hosting}
            </p>
            <p>
              {companyInfo.escrow}{" "}
              <a href="#" className="info-link">
                {companyInfo.escrowLink}
              </a>{" "}
              {companyInfo.escrowDesc}
            </p>
            <p>
              대표전화 {companyInfo.phone} | 이메일: {companyInfo.email}
            </p>
          </div>

          {/* 저작권 및 인증 영역 */}
          <div className="footer-bottom">
            {/* 카피라이트 - 한 줄 전체 차지 */}
            <div className="footer-bottom-left">
              <p>
                Copyright (C) {currentYear} Samsung C&T Corporation. All rights
                reserved
              </p>
            </div>

            {/* 인증 영역 - 아래 줄 */}
            <div className="footer-bottom-right">
              <div className="certification">
                <img
                  src="https://ext.same-assets.com/947818454/209907754.png"
                  alt="ISMS 인증마크"
                />
                <p>
                  인증범위 : 패션부문 온라인 쇼핑몰 서비스 운영 (SSFSHOP, 토리버치) |
                  유효기간 : 2025.08.12 ~ 2028.08.11
                </p>
              </div>
              <div className="social-icons">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="유튜브"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#999" />
                    <path
                      d="M24 12.3C24 12.3 23.8 10.9 23.2 10.3C22.4 9.5 21.5 9.5 21.1 9.4C18.2 9.2 16 9.2 16 9.2C16 9.2 13.8 9.2 10.9 9.4C10.5 9.5 9.6 9.5 8.8 10.3C8.2 10.9 8 12.3 8 12.3C8 12.3 8 13.9 8 15.6V17.2C8 18.9 8 20.5 8 20.5C8 20.5 8.2 21.9 8.8 22.5C9.6 23.3 10.6 23.3 11.1 23.4C12.8 23.6 16 23.6 16 23.6C16 23.6 18.2 23.6 21.1 23.4C21.5 23.3 22.4 23.3 23.2 22.5C23.8 21.9 24 20.5 24 20.5C24 20.5 24 18.9 24 17.2V15.6C24 13.9 24 12.3 24 12.3ZM14 19V13L20 16L14 19Z"
                      fill="white"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="인스타그램"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#999" />
                    <path
                      d="M12 8C9.8 8 8 9.8 8 12V20C8 22.2 9.8 24 12 24H20C22.2 24 24 22.2 24 20V12C24 9.8 22.2 8 20 8H12ZM21 10C21.6 10 22 10.4 22 11C22 11.6 21.6 12 21 12C20.4 12 20 11.6 20 11C20 10.4 20.4 10 21 10ZM16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12ZM16 14C14.9 14 14 14.9 14 16C14 17.1 14.9 18 16 18C17.1 18 18 17.1 18 16C18 14.9 17.1 14 16 14Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이메일 무단수집거부 모달 */}
      <EmailPolicyModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </footer>
  );
}
