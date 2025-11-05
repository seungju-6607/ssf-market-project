import React, { useState } from "react";
import "./HelpPage.css";

const faqData = [
  {
    category: "주문/배송",
    items: [
      { q: "주문 후 배송은 얼마나 걸리나요?", a: "주문 확인 후 2-3일 이내에 배송됩니다. 제주도 및 도서산간 지역은 추가 1-2일이 소요됩니다." },
      { q: "배송 조회는 어떻게 하나요?", a: "마이페이지 > 주문내역에서 배송 상태를 확인하실 수 있습니다." },
      { q: "배송비는 얼마인가요?", a: "3만원 이상 구매 시 무료배송이며, 그 이하는 3,000원의 배송비가 부과됩니다." }
    ]
  },
  {
    category: "취소/환불",
    items: [
      { q: "주문을 취소하고 싶어요.", a: "배송 전이라면 마이페이지에서 직접 취소 가능합니다. 배송 후에는 고객센터(1644-XXXX)로 문의해주세요." },
      { q: "환불은 언제 되나요?", a: "반품 상품 확인 후 2-3영업일 이내에 환불 처리됩니다." },
      { q: "교환도 가능한가요?", a: "상품 수령 후 7일 이내 미사용 상품에 한해 교환이 가능합니다." }
    ]
  },
  {
    category: "회원/포인트",
    items: [
      { q: "회원가입 혜택이 있나요?", a: "신규 회원 가입 시 10,000원 쿠폰을 즉시 지급해드립니다." },
      { q: "포인트는 어떻게 사용하나요?", a: "결제 시 포인트를 선택하여 사용할 수 있으며, 1포인트 = 1원입니다." },
      { q: "회원 등급이 있나요?", a: "구매 금액에 따라 실버, 골드, VIP 등급으로 나뉘며, 등급별 추가 혜택이 제공됩니다." }
    ]
  },
  {
    category: "상품/사이즈",
    items: [
      { q: "사이즈 교환이 가능한가요?", a: "상품 수령 후 7일 이내 미착용 상품에 한해 사이즈 교환이 가능합니다." },
      { q: "사이즈 가이드를 보고 싶어요.", a: "각 상품 상세 페이지에서 사이즈 가이드를 확인하실 수 있습니다." },
      { q: "품절된 상품 재입고 알림을 받고 싶어요.", a: "상품 상세 페이지에서 '재입고 알림 신청'을 클릭하시면 재입고 시 알림을 받으실 수 있습니다." }
    ]
  }
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("주문/배송");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentFaq = faqData.find((cat) => cat.category === activeCategory);

  return (
    <div className="help-page">
      <div className="help-container">
        <h1 className="help-title">고객센터</h1>
        <p className="help-subtitle">무엇을 도와드릴까요?</p>

        {/* 고객센터 연락처 */}
        <div className="help-contact">
          <div className="contact-item">
            <h3>전화 문의</h3>
            <p className="contact-value">1644-XXXX</p>
            <p className="contact-time">평일 09:00 - 18:00</p>
          </div>
          <div className="contact-item">
            <h3>이메일 문의</h3>
            <p className="contact-value">support@shop.com</p>
            <p className="contact-time">24시간 접수 가능</p>
          </div>
          <div className="contact-item">
            <h3>카카오톡 상담</h3>
            <p className="contact-value">@SSF_SHOP</p>
            <p className="contact-time">평일 10:00 - 17:00</p>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="faq-section">
          <h2 className="faq-title">자주 묻는 질문</h2>

          {/* 카테고리 탭 */}
          <div className="faq-tabs">
            {faqData.map((cat) => (
              <button
                key={cat.category}
                className={`faq-tab ${activeCategory === cat.category ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.category)}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* FAQ 아이템 */}
          <div className="faq-list">
            {currentFaq?.items.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openIndex === index ? "open" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <span>Q. {item.q}</span>
                  <span className="faq-icon">{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>A. {item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 1:1 문의 안내 */}
        <div className="inquiry-box">
          <h3>원하시는 답변을 찾지 못하셨나요?</h3>
          <p>1:1 문의하기를 통해 더 자세한 상담을 받아보세요.</p>
          <button className="inquiry-button">1:1 문의하기</button>
        </div>
      </div>
    </div>
  );
}
