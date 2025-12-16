"use client";

import {useState, useEffect, Fragment} from 'react';
import {getPayment} from '@/utils/paymentAPI.js';
import {showCart} from "@/utils/cartAPI.js";
import {useAuthStore} from "@/store/authStore.js";

export default function CheckoutInfo() {
    const userId = useAuthStore((s) => s.userId);
    const [cartList, setCartList] = useState([]);
    const [userInfo, setUserInfo] = useState({name:"", phone:"", email:""});
    const [totalPrice, setTotalPrice] = useState(0);
    const [terms, setTerms] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [payment, setPayment] = useState("kakao");

    const [receiver, setReceiver] = useState({
        "name": "홍길동",
        "phone": "010-1234-1234",
        "zipcode": "12345",
        "address1": "서울시 강남구 역삼동",
        "address2": "123",
        "memo": "문앞"
    });
    const [paymentInfo, setPaymentInfo] = useState({
        "shippingFee": "0",
        "discountAmount": "0",
        "totalAmount": "0"
    });

    useEffect(() => {
        const fetchData = async () => {
            const cartList = await showCart(userId);
            setCartList(cartList);
            setUserInfo({name:cartList[0].mname, phone:cartList[0].phone, email:cartList[0].email});
            setTotalPrice(cartList[0].totalPrice);
        }
        fetchData();
    }, [])

    /** payment button */
    const handlePayment = async() => {
        if (!terms || !privacy) {
            alert("필수 약관에 모두 동의해야 결제가 가능합니다.");
            return;
        } else {
            const result = await getPayment(receiver, paymentInfo, cartList);
        }
    }

    return (
        <div className="cart-container">
            <h2 className="cart-header">주문/결제</h2>
            <div className="section">
                {/* 구매자 정보 */}
                <h2 className="section-title">구매자정보</h2>
                <div className="info-box">
                    <div className="info-grid">
                        <div className="label">이름</div>
                        <div className="value">{userInfo.name}</div>

                        <div className="label">이메일</div>
                        <div className="value">{userInfo.email}</div>

                        <div className="label">휴대폰 번호</div>
                        <div className="value" style={{display:"flex", alignItems:"baseline"}}>{userInfo.phone} <button style={{marginLeft:"20px"}}>회원 정보 수정</button></div>
                    </div>
                </div>
            </div>
            {/* 받는사람 정보 */}
            <div className="section">
                <h2 className="section-title">
                    받는사람정보 &nbsp;&nbsp;&nbsp;
                    <button>배송지 변경</button>
                </h2>
                <div className="info-box">
                    <div className="info-grid">
                        <div className="label">이름</div>
                        <div className="value">{receiver.name}</div>

                        <div className="label">배송주소</div>
                        <div className="value">{receiver.zipcode} / {receiver.address1} {receiver.address2}</div>

                        <div className="label">연락처</div>
                        <div className="value">{receiver.phone}</div>

                        <div className="label">배송 요청사항</div>
                        <div className="value phone-input">
                            <input type="text" defaultValue={receiver.memo} />
                            <button className="btn">변경</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 주문 정보 */}
            <div className="section">
                <h2 className="section-title">주문 상품</h2>
                <div className="info-box">
                    <div className="info-grid">
                        { cartList && cartList.map(item =>
                            <Fragment key={item.cid ?? item.pid ?? item.name}>
                                <div className="label">상품명</div>
                                <div className="value">
                                    <img src={`/images/${item.image}`} alt="product image" style={{width:'35px'}} />
                                    {item.name}, {item.info}, 수량({item.qty}), 가격({item.price.toLocaleString()}원)
                                </div>
                            </Fragment>
                        )}
                    </div>
                </div>
            </div>

            <div className="section">
                <h2>결제정보</h2>
                <table className="payment-table">
                    <tbody>
                        <tr>
                            <td>총상품가격</td>
                            <td className="price">{totalPrice.toLocaleString()}원</td>
                        </tr>
                        <tr>
                            <td>즉시할인</td>
                            <td className="discount">-0원</td>
                        </tr>
                        <tr>
                            <td>할인쿠폰</td>
                            <td className="coupon">
                                0원 <span className="info">적용 가능한 할인쿠폰이 없습니다.</span>
                            </td>
                        </tr>
                        <tr>
                            <td>배송비</td>
                            <td className="price">0원</td>
                        </tr>
                        <tr>
                            <td>쿠페이캐시</td>
                            <td className="price">
                                0원 <span className="info">보유 : 0원</span>
                            </td>
                        </tr>
                        <tr className="total">
                            <td>총결제금액</td>
                             <td className="total-price">{totalPrice.toLocaleString()}원</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="section">
                <h2>결제 수단</h2>
                <div className="payment-method">
                    <label className="radio-label">
                        <input type="radio"
                               name="payment"
                               value="kakao"
                               checked={payment === "kakao"}
                               onChange={(e) => setPayment(e.target.value)} /> 카카오페이
                        <span className="badge">최대 캐시적립</span>
                    </label>
                </div>

                <div className="payment-method">
                    <label className="radio-label">
                        <input type="radio"
                               name="payment"
                               value="naver"
                               checked={payment === "naver"}
                               onChange={(e) => setPayment(e.target.value)}
                                /> 네이버페이
                    </label>
                </div>

                <div className="payment-method">
                    <label className="radio-label">
                        <input type="radio" name="payment" />
                        다른 결제 수단 <span className="arrow">▼</span>
                    </label>
                </div>
            </div>

            <div className="terms">
                <input type="checkbox"
                       id="terms"
                       name="terms"
                       checked={terms}
                       onChange={(e) => setTerms(e.target.checked)}/>
                <label htmlFor="terms"> 구매조건 확인 및 결제대행 서비스 약관 동의</label>
                <br />
                <input type="checkbox"
                       id="privacy"
                       name="privacy"
                       checked={privacy}
                       onChange={(e) => setPrivacy(e.target.checked)} />
                <label htmlFor="privacy"> 개인정보 국외 이전 동의</label>
            </div>
            <button className="pay-button" onClick={handlePayment}>결제하기</button>
        </div>
    );
}