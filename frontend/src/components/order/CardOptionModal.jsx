import "./CardOptionModal.css";

const CARD_INSTALLMENTS = [
    { name: "농협카드", max: "최대 6개월", range: "2~6개월" },
    { name: "우리카드", max: "최대 5개월", range: "2~5개월" },
    { name: "비씨카드", max: "최대 5개월", range: "2~5개월" },
    { name: "국민카드", max: "최대 5개월", range: "2~5개월" },
    { name: "롯데카드", max: "최대 5개월", range: "2~5개월" },
    { name: "하나카드", max: "최대 4개월", range: "2~4개월" },
    { name: "신한카드", max: "최대 3개월", range: "2~3개월" },
    { name: "삼성카드", max: "최대 3개월", range: "2~3개월" },
    { name: "현대카드", max: "최대 3개월", range: "2~3개월" },
    { name: "전북카드", max: "최대 3개월", range: "2~3개월" },
  ];
  
  const CardBenefitModal = ({ open, onClose }) => {
    if (!open) return null;
  
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="card-benefit-modal"
          onClick={(e) => e.stopPropagation()} // 안쪽 클릭 시 닫히지 않게
        >
          <header className="cbm-header">
            <h2 className="cbm-title">카드사별 혜택 안내</h2>
            <button
              type="button"
              className="cbm-close"
              aria-label="닫기"
              onClick={onClose}
            >
              ✕
            </button>
          </header>
  
          <div className="cbm-body">
            <h3 className="cbm-subtitle">무이자 할부</h3>
  
            <div className="cbm-list">
              {CARD_INSTALLMENTS.map((card) => (
                <div key={card.name} className="cbm-row">
                  <div className="cbm-row-left">{card.name}</div>
                  <div className="cbm-row-right">
                    <div className="cbm-row-max">{card.max}</div>
                    <div className="cbm-row-range">{card.range}</div>
                  </div>
                </div>
              ))}
            </div>
  
            <section className="cbm-notice">
              <h4 className="cbm-notice-title">신용카드 할인이 적용되지 않는 경우</h4>
              <ul className="cbm-notice-list">
                <li>체크카드, 법인카드의 경우 무이자 할부 행사에서 제외됩니다.</li>
                <li>KG모빌리언스 명의로 청구되는 가맹점에 한합니다.</li>
                <li>
                  사용카드로 결제하시는 최종 결제 금액의 위약 기준 금액 미만이거나,
                  그 외 무이자 할부가 되지 않는 기타 신용카드를 사용하시는 경우는
                  유이자 할부로 결제되오니 반드시 참고하시기 바랍니다.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  };
  
  export default CardBenefitModal;
  