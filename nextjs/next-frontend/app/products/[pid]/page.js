import { PiGiftThin } from 'react-icons/pi';
import { axiosGet } from "@/utils/dataFetch.js";
import { ImageList } from "@/components/commons/ImageList.jsx";
import { StarRating } from "@/components/commons/StarRating.jsx";
import Tabs from "@/components/commons/Tabs";
import Detail  from "@/components/detailTabs/Detail.jsx";
import Review from "@/components/detailTabs/Review.jsx";
import QnA from "@/components/detailTabs/QnA.jsx";
import Return from "@/components/detailTabs/Return.jsx";
import PurchaseActions from "@/app/products/[pid]/PurchaseActions";


const getProduct = async(pid) => {
    const url = `/product/${pid}`;
    const product = await axiosGet(url);
    return product;
}


export default async function ProductDetail( {params, searchParams } ) {
    const { pid } = await params;
    
    //하단의 Tabs 클라이언트 컴포넌트에서 버튼 이벤트 발생시 서버가 렌더링되면서 searchParams 형식으로 넘어오는 값
    const sp = await searchParams;
    const tabName = sp?.tabName ?? "detail";  //처음 실행 시 searchParams 값이 없으면 초기값으로 'detail'

    const product = await getProduct(pid);
    const imgList = JSON.parse(product.imgList);

    return (
        <div className="content">
            <div className='product-detail-top'>
                <div className='product-detail-image-top'>
                    <img src={product.image && `/images/${product.image}`} />
                    <ImageList  className="product-detail-image-top-list" imgList={imgList}/>
                </div>
                <ul className='product-detail-info-top'>
                    <li className='product-detail-title'>{product.name}</li>
                    <li className='product-detail-title'>
                        {`${parseInt(product.price).toLocaleString()}원`}
                        {/* {parseInt(product.price).toLocaleString()}원 */}
                    </li>
                    <li className='product-detail-subtitle'>{product.info}</li>
                    <li className='product-detail-subtitle-star'>
                        <StarRating  totalRate={product.rate}
                                     style="star-coral"
                        />
                        <span>527개 리뷰 &nbsp;&nbsp; {">"} </span>
                    </li>
                    <li>
                        <p className='product-detail-box'>신규회원, 무이자할부 등</p>
                    </li>

                    {/* 구매관련(쇼핑백담기, 바로구매 등..) 이벤트 컴포넌트(클라이언트) */}
                    <PurchaseActions pid={product.pid}/>


                    {/*<li className='flex'>*/}
                    {/*    <button className='product-detail-button size'>사이즈</button>*/}
                    {/*    <select*/}
                    {/*        className="product-detail-select2"*/}
                    {/*        // onChange={(e) => setSize(e.target.value)}*/}
                    {/*    >*/}
                    {/*        <option value="XS">XS</option>*/}
                    {/*        <option value="S">S</option>*/}
                    {/*        <option value="M">M</option>*/}
                    {/*        <option value="L">L</option>*/}
                    {/*        <option value="XL">XL</option>*/}
                    {/*    </select>*/}
                    {/*</li>*/}
                    {/*<li className="flex">*/}
                    {/*    <button type="button"*/}
                    {/*            className="product-detail-button order">바로 구매</button>*/}
                    {/*    <button type="button"*/}
                    {/*            className="product-detail-button cart"*/}
                    {/*            // onClick={()=>{*/}
                    {/*            //     isLogin? dispatch(addCart(product.pid, size))*/}
                    {/*            //         : navigate("/login")}}*/}
                    {/*    > 쇼핑백 담기</button>*/}
                    {/*    <div type="button" className="gift">*/}
                    {/*        <PiGiftThin />*/}
                    {/*        <div className="gift-span">선물하기</div>*/}
                    {/*    </div>*/}
                    {/*</li>*/}
                    <li>
                        <ul className='product-detail-summary-info'>
                            <li>상품 요약 정보</li>
                        </ul>
                    </li>
                </ul>
            </div>

            {/*---------- Tab 출력 시작 ----------*/}
            <div className='product-detail-tab'>
                {/* Tab을 구성하고 버튼 이벤트 처리를 위한 클라이언트 컴포넌트 */}
                <Tabs currentTab={ tabName }/>

                {/* Tab에서 이벤트 발생 시 서버에서 재호출이 일어나면 searchParams를 통해 변경된 tabName을 받아 reRendering */}
                {tabName === "detail" &&  <Detail imgList={imgList} pid={pid} />}
                {tabName === "review" &&  <Review />}
                {tabName === "qna" &&  <QnA pid={pid} />}
                {tabName === "return" &&  <Return />}

                {/*</div>*/}
                <div style={{marginBottom:"50px"}}></div>
            </div>
            {/*---------- Tab 출력 종료 ----------*/}
        </div>
    );
}

