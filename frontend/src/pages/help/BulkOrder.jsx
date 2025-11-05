import React, { useState } from "react";
import { createBulkOrder } from "../../api/orders";
import "./BulkOrder.css";

export default function BulkOrder() {
  const [form, setForm] = useState({
    inquirerName: "",      // 문의자명
    companyName: "",       // 업체명
    phone: "",             // 연락처
    email: "",             // 이메일
    requestBrand: "",      // 요청브랜드
    productNo: "",         // 상품번호
    quantity: "",          // 구매희망수량
    needDate: "",          // 필요일자
    message: "",           // 문의내용
    agree: false,          // 개인정보 동의
    replyNotify: false,    // 답변등록 알림톡/SMS 수신
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // 필수값 간단검증
    if (!form.inquirerName || !form.companyName || !form.phone || !form.email) {
      alert("문의자명/업체명/연락처/이메일은 필수입니다.");
      return;
    }
    if (!form.agree) {
      alert("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    const id = createBulkOrder(form);
    if (id) {
      alert(`단체주문 문의가 접수되었습니다.\n접수번호: ${id}`);
      // 원하면 관리자 페이지로 바로 이동:
      // window.location.href = "/#/admin/orders";
      // 또는 현재 폼 초기화
      setForm({
        inquirerName: "",
        companyName: "",
        phone: "",
        email: "",
        requestBrand: "",
        productNo: "",
        quantity: "",
        needDate: "",
        message: "",
        agree: false,
        replyNotify: false,
      });
    } else {
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="bulk-wrap">
      <div className="bulk-header">
        <h1>단체주문</h1>
      </div>

      <form className="bulk-form" onSubmit={onSubmit}>
        <div className="bulk-grid">
          {/* 좌측 라벨 · 우측 입력 */}
          <label className="bulk-label required">문의자명</label>
          <input
            className="bulk-input"
            name="inquirerName"
            value={form.inquirerName}
            onChange={onChange}
            placeholder="성함을 입력하세요"
          />

          <label className="bulk-label required">업체명</label>
          <input
            className="bulk-input"
            name="companyName"
            value={form.companyName}
            onChange={onChange}
            placeholder="업체/기관명을 입력하세요"
          />

          <label className="bulk-label required">연락처</label>
          <input
            className="bulk-input"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="예) 010-1234-5678"
          />

          <label className="bulk-label required">이메일</label>
          <input
            className="bulk-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="예) hello@example.com"
          />

          <label className="bulk-label">요청브랜드</label>
          <input
            className="bulk-input"
            name="requestBrand"
            value={form.requestBrand}
            onChange={onChange}
            placeholder="브랜드명을 입력하세요"
          />

          <label className="bulk-label">상품번호</label>
          <input
            className="bulk-input"
            name="productNo"
            value={form.productNo}
            onChange={onChange}
            placeholder="상품번호가 있을 경우 입력"
          />

          <label className="bulk-label">구매희망수량</label>
          <input
            className="bulk-input"
            name="quantity"
            value={form.quantity}
            onChange={onChange}
            placeholder="예) 100"
          />

          <label className="bulk-label">필요일자</label>
          <input
            className="bulk-input"
            name="needDate"
            value={form.needDate}
            onChange={onChange}
            placeholder="예) 2025-11-30"
          />

          <label className="bulk-label">문의내용</label>
          <textarea
            className="bulk-textarea"
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder={
              "단체 주문 문의 시 아래 필수 항목을 꼭 작성해주세요.\n\n담당자명:\n연락처(핸드폰번호 필수):\n이메일:\n요청 브랜드:\n품번:\n\n특수문자 W/: < > 는 사용할 수 없습니다."
            }
          />

          {/* 체크박스 영역 */}
          <div className="bulk-label"></div>
          <label className="bulk-checkbox">
            <input
              type="checkbox"
              name="replyNotify"
              checked={form.replyNotify}
              onChange={onChange}
            />
            &nbsp;답변등록여부 알림톡, SMS수신
          </label>
        </div>

        {/* 개인정보 수집·이용 동의 */}
        <div className="bulk-privacy">
          <div className="bulk-privacy-head">
            <label className="bulk-checkbox">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
              />
              &nbsp;개인정보 수집 이용에 대한 동의 (필수)
            </label>
          </div>
          <div className="bulk-privacy-box">
            <p>
              회사는 단체주문 문의를 처리하기 위해 아래와 같이 개인정보를 수집 및 이용합니다. 내용을 자세히
              읽으신 후 동의 여부를 결정하여 주십시오.
            </p>
            <ul>
              <li>수집/이용 목적: 단체주문 문의의 처리 및 응대</li>
              <li>수집/이용 항목: 이름, 연락처, 이메일</li>
              <li>보유 및 이용기간: 3년 보관 후 파기</li>
            </ul>
            <p>동의를 거부할 권리가 있으며, 거부 시 문의 작성이 제한됩니다.</p>
          </div>
        </div>

        <div className="bulk-actions">
          <button
            type="button"
            className="bulk-btn ghost"
            onClick={() => window.history.back()}
          >
            취소
          </button>
          <button type="submit" className="bulk-btn primary">
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
