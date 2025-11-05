import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="navbar" onMouseLeave={handleMouseLeave}>
      <ul className="navbar-list">
        <li onMouseEnter={() => handleMouseEnter("women")}>
          <Link to="/women">여성</Link>
          {activeMenu === "women" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li><li>아우터</li><li>재킷/베스트</li>
                  <li>니트</li><li>셔츠/블라우스</li><li>티셔츠</li><li>원피스</li><li>팬츠</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <ul>
                  <li>스커트</li><li>라운지/언더웨어</li><li>비치웨어</li><li>패션잡화</li><li>쥬얼리/시계</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>에잇세컨즈</li><li>빈폴</li><li>구호</li><li>아미</li><li>메종키츠네</li>
                  <li>코스</li><li>라코스테</li><li>노스페이스</li><li>알투더블유</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("men")}>
          <Link to="/men">남성</Link>
          {activeMenu === "men" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li><li>아우터</li><li>정장</li>
                  <li>팬츠</li><li>재킷/베스트</li><li>셔츠</li><li>니트</li><li>티셔츠</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <ul>
                  <li>패션잡화</li><li>언더웨어</li><li>비치웨어</li><li>쥬얼리/시계</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>에잇세컨즈</li><li>빈폴</li><li>아미</li><li>준지</li><li>로가디스</li>
                  <li>띠어리</li><li>랩</li><li>갤럭시</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("kids")}>
          <Link to="/kids">키즈</Link>
          {activeMenu === "kids" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li><li>남아</li><li>여아</li>
                  <li>베이비</li><li>완구/교구</li><li>용품</li><li>래시가드/수영복</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>빈폴키즈</li><li>라코스테 키즈</li><li>아디다스 키즈</li>
                  <li>닥스리틀</li><li>코코안</li><li>헤지스키즈</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("luxury")}>
          <Link to="/luxury">럭셔리</Link>
          {activeMenu === "luxury" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li>
                  <li>여성의류</li><li>남성의류</li>
                  <li>여성가방/지갑</li><li>남성가방/지갑</li>
                  <li>쥬얼리/시계</li><li>선글라스/안경테</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>메종키츠네</li><li>띠어리</li><li>아미</li><li>바오바오</li>
                  <li>버버리</li><li>구찌</li><li>막스마라</li><li>몽클레어</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("shoes")}>
          <Link to="/shoes">백&슈즈</Link>
          {activeMenu === "shoes" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li><li>여성가방</li>
                  <li>남성가방</li><li>여성슈즈</li><li>남성슈즈</li><li>여행용품</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>토리버치</li><li>구호</li><li>빈폴 액세서리</li><li>르메르</li>
                  <li>뉴발란스</li><li>에잇세컨즈</li><li>아디다스</li><li>나이키</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("sports")}>
          <Link to="/sports">스포츠</Link>
          {activeMenu === "sports" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li>
                  <li>아웃도어/캠핑</li><li>러닝/사이클</li><li>피트니스</li>
                  <li>요가/필라테스</li><li>수영</li><li>테니스</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>아디다스</li><li>아식스</li><li>노스페이스</li><li>데상트</li>
                  <li>언더아머</li><li>K2</li><li>휠라</li><li>푸마</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("golf")}>
          <Link to="/golf">골프</Link>
          {activeMenu === "golf" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li>
                  <li>여성 골프의류</li><li>남성 골프의류</li>
                  <li>골프클럽</li><li>골프백</li><li>골프ACC</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>빈폴골프</li><li>구호 골프</li><li>PXG</li><li>아디다스 골프</li>
                  <li>데상트골프</li><li>테일러메이드</li><li>마크앤로나</li><li>파리게이츠</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("beauty")}>
          <Link to="/beauty">뷰티</Link>
          {activeMenu === "beauty" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li>
                  <li>스킨케어</li><li>메이크업</li><li>향수</li><li>헤어케어</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>헤라</li><li>설화수</li><li>코이</li><li>연작</li>
                  <li>오니스트</li><li>닥터지</li><li>프리메라</li><li>아이오페</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("life")}>
          <Link to="/life">라이프</Link>
          {activeMenu === "life" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>메인</li><li>신상품</li><li>전체 상품</li>
                  <li>가구</li><li>조명</li><li>홈데코</li><li>반려동물</li><li>식품</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>까사미아</li><li>한샘</li><li>이케아</li><li>데코뷰</li>
                </ul>
              </div>
            </div>
          )}
        </li>

        <li onMouseEnter={() => handleMouseEnter("outlet")}>
          <Link to="/outlet">아울렛</Link>
          {activeMenu === "outlet" && (
            <div className="dropdown">
              <div className="dropdown-column">
                <ul>
                  <li>전체 상품</li><li>여성</li><li>남성</li><li>키즈</li>
                  <li>럭셔리</li><li>백&슈즈</li><li>스포츠</li><li>골프</li><li>라이프</li>
                </ul>
              </div>
              <div className="dropdown-column">
                <h4>Top Brand</h4>
                <ul>
                  <li>메종키츠네</li><li>빈폴</li><li>구호</li><li>에잇세컨즈</li>
                  <li>준지</li><li>아미</li><li>랄프로렌</li><li>라코스테</li>
                </ul>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
