import React, {useState, useEffect} from 'react';
import { SearchForm } from '../components/commons/SearchForm.jsx';
import { MenuList } from '../components/commons/MenuList.jsx';
import { axiosData } from '../utils/dataFetch.js';
import { getList, getSearchList } from '../feature/support/supportAPI.js';
//-- 페이징 처리 추가
import Pagination from 'rc-pagination';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-pagination/assets/index.css';

export function Support() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [menus, setMenus] = useState([]);
    const [category, setCategory] = useState([]);
    const [list, setList] = useState([]);
    const [stype, setStype] = useState('all');
    const [searchData, setSearchData] = useState({});
    const [type, setType] = useState("menu");

    useEffect(()=>{
        const fetch = async() => {
            const jsonData = await axiosData("/data/support.json"); //카테고리 가져오기
            setMenus(jsonData.menus);
            setCategory(jsonData.category);

            if(type === 'menu') executeMenu();
            else if(type === 'search') executeSearch();
        }
        fetch();
    }, [currentPage, stype, searchData]);

    const executeMenu = async() => {
        const data = { "stype": stype,
                      "currentPage": currentPage,
                      "pageSize": pageSize}
            const pageList = await getList(data);
            setList(pageList.list);
            setTotalCount(pageList.totalCount);
    }

    const executeSearch = async() => {
        const data = {
                    "type": searchData.type,
                    "keyword": searchData.keyword,
                    "currentPage": currentPage,
                    "pageSize": pageSize
                }
            const pageList = await getSearchList(data);
            setList(pageList.list);
            setTotalCount(pageList.totalCount);
    }

    const filterList = async(stype) => {
        setStype(stype);
        setCurrentPage(1);
        setType("menu");
        executeMenu();
    }

    const handleSearch = async (searchData) => {
         setType("search");
         setSearchData(searchData);
         setCurrentPage(1);
    }

    return (  
        <div className="content">
            <div className="support center-layout">
                <h1 className="center-title">공지/뉴스</h1>
                <div className="support-content">
                    <p style={{color:"#777"}}>CGV의 주요한 이슈 및 여러가지 소식들을 확인할 수 있습니다.</p>
                    <SearchForm category={category} search={handleSearch}/>
                    <nav><MenuList menus={menus} filterList={filterList} /></nav>
                    <p style={{color:"#777"}}>총 114건이 검색되었습니다. </p>

                    {/* list 내용 출력 - 테이블 */}
                    <table >
                        <thead>
                            <tr>
                                <th>번호</th><th>구분</th><th>제목</th><th>등록일</th><th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list && list.map((item, idx) => 
                                <tr>
                                    <td>{item.rowNumber}</td>
                                    <td>[{item.stype}]</td>
                                    <td>{item.title}</td>
                                    <td>{item.rdate}</td>
                                    <td>{item.hits}</td>
                                </tr>                    
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    {/* 페이징 처리 출력 컴포넌트 */}
                                    <Pagination
                                      className="d-flex justify-content-center"
                                      current = {currentPage}
                                      total = {totalCount}
                                      pageSize = {pageSize}
                                      onChange = {(page) => setCurrentPage(page) }/>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
        </div>
    );
}

