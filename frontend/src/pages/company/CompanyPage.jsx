import React from "react";
import "./CompanyPage.css";

export default function CompanyPage() {
  return (
    <div className="company-page">
      <div className="company-hero">
        <h1>SSF SHOP</h1>
        <p>프리미엄 패션 라이프스타일을 제안합니다</p>
      </div>

      <div className="company-container">
        {/* 회사 소개 */}
        <section className="company-section">
          <h2>회사 소개</h2>
          <div className="company-content">
            <p>
              SSF SHOP은 삼성물산 패션부문이 운영하는 온라인 편집샵으로,
              국내외 프리미엄 브랜드들을 한곳에서 만나볼 수 있는 패션 플랫폼입니다.
            </p>
            <p>
              8SECONDS, BEANPOLE, KUHO 등 자체 브랜드부터
              Theory, COS, LEMAIRE 등 글로벌 브랜드까지
              다양한 스타일을 제안합니다.
            </p>
          </div>
        </section>

        {/* 핵심 가치 */}
        <section className="company-section">
          <h2>핵심 가치</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>품질</h3>
              <p>엄선된 브랜드와 제품만을 고객에게 제공합니다</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>혁신</h3>
              <p>트렌드를 선도하는 패션 큐레이션을 제공합니다</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>신뢰</h3>
              <p>고객과의 약속을 최우선으로 생각합니다</p>
            </div>
          </div>
        </section>

        {/* 연혁 */}
        <section className="company-section">
          <h2>연혁</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2025</div>
              <div className="timeline-content">
                <h4>글로벌 브랜드 확장</h4>
                <p>해외 럭셔리 브랜드 입점 강화</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2020</div>
              <div className="timeline-content">
                <h4>온라인 플랫폼 리뉴얼</h4>
                <p>모바일 최적화 및 UX 개선</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2015</div>
              <div className="timeline-content">
                <h4>SSF SHOP 공식 런칭</h4>
                <p>삼성물산 패션 온라인몰 오픈</p>
              </div>
            </div>
          </div>
        </section>

        {/* 채용 정보 */}
        <section className="company-section">
          <h2>함께 성장할 인재를 찾습니다</h2>
          <div className="recruit-box">
            <h3>채용 안내</h3>
            <p>패션에 대한 열정과 창의성을 가진 분들의 많은 지원 바랍니다.</p>
            <ul className="recruit-list">
              <li>MD (Merchandiser)</li>
              <li>마케팅 전문가</li>
              <li>CS 담당자</li>
              <li>웹 개발자</li>
            </ul>
            <button className="recruit-button">채용 공고 보기</button>
          </div>
        </section>

        {/* 회사 정보 */}
        <section className="company-section">
          <h2>회사 정보</h2>
          <div className="company-info-grid">
            <div className="info-item">
              <h4>회사명</h4>
              <p>삼성물산(주) 패션부문</p>
            </div>
            <div className="info-item">
              <h4>대표자</h4>
              <p>오세철 외 2명</p>
            </div>
            <div className="info-item">
              <h4>사업자등록번호</h4>
              <p>101-86-43805</p>
            </div>
            <div className="info-item">
              <h4>주소</h4>
              <p>서울특별시 강남구 남부순환로 2806</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
