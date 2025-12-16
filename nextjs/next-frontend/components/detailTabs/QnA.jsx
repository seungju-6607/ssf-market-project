
import {axiosPost} from "@/utils/dataFetch.js";
import ItemContent from "@/components/commons/ItemContent.jsx";

export const getQna = async(pid) => {
    const url = "/product/qna";
    const qna  = await axiosPost(url, {"pid": pid});
    return qna;
}

export default async function QnA({ pid }) {
    const qnaData = await getQna(pid);
    const openQid = null;

   const handleToggle = (qid) => {
        setOpenQid(prev => (prev === qid) ? null : qid);
   }

   const handleToggleButton = () => {
        setIsOpen(!isOpen);
   }

    return (
        <div>
            <div style={{paddingTop:"20px"}}>
                {/*{isOpen && */}
                {/*    <button type="button" */}
                {/*            style={{backgroundColor:"green"}}*/}
                {/*            onClick={handleToggleButton}>*/}
                {/*        상품 문의</button>                    */}
                {/*}*/}
                {/*{!isOpen && */}
                {/*    <button type="button" */}
                {/*            style={{backgroundColor:"coral"}}*/}
                {/*            onClick={handleToggleButton}>*/}
                {/*        상품 문의</button>*/}
                {/*}    */}
                {/*{!isOpen && <span>버튼이 코랄색 입니다.</span>}            */}
            </div>
            <table className='review-list-content'>
                <tbody>
                    {qnaData && qnaData.map((item, idx) =>
                        <tr key={idx}>
                            <td style={{width:"10%"}}>
                                {item.isComplete ? <span>답변완료</span>
                                                 : <span>답변준비중</span> }
                            </td>
                            <td style={{width:"60%"}} >
                                <ItemContent item={item} />  {/* 아이템 클릭 이벤트 처리 담당 클라이언트 컴포넌트 */}
                            </td>
                            <td style={{width:"15%"}}>{item.id}</td>
                            <td>{item.cdate}</td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={4}>{"<< "} 1 2 3 4 5 {" >>"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

