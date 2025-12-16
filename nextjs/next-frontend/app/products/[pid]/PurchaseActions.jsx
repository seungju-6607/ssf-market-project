"use client";

import {useAuthStore} from "@/store/authStore.js";
import {useRouter} from "next/navigation";
import {PiGiftThin} from "react-icons/pi";
import {useState, useEffect} from "react";
import {addCart} from "@/utils/cartAPI.js";

export default function PurchaseActions({pid}) {
    const router = useRouter();
    const [size, setSize] = useState("XS");
    const [showCartPopup, setShowCartPopup] = useState(false);
    const isLogin = useAuthStore((s) => s.isLogin);
    const userId = useAuthStore((s) => s.userId);

    const handleAddCart = async() => {
        const result = addCart(pid, size, userId)
        if (result) {
            setShowCartPopup(true);
        }
    }

    return (
        <>
            <li className="flex">
                <button className='product-detail-button size'>사이즈</button>
                <select
                    className="product-detail-select2"
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
            </li>
            <li className="flex"  style={{position: "relative"}}>
                {/* ✅ 장바구니 팝업 */}
                {showCartPopup && (
                    <div className="cart-popup">
                        <p>상품을 장바구니에 담았습니다.</p>
                        <p>이미 담으신 상품이 있습니다.</p>
                        <strong>장바구니로 이동하시겠습니까?</strong>

                        <div className="cart-popup-buttons">
                            <button type="button" onClick={() => setShowCartPopup(false)}>
                                쇼핑 계속하기
                            </button>
                            <button type="button" onClick={() => { router.push('/cart'); }}>
                                장바구니 가기
                            </button>
                        </div>
                    </div>
                )}
                <button type="button"
                        className="product-detail-button order">바로 구매</button>
                <button type="button"
                        className="product-detail-button cart"
                        onClick={()=>{
                            isLogin ? handleAddCart()
                            : router.push("/login")}}
                > 쇼핑백 담기</button>
                <div type="button" className="gift">
                    <PiGiftThin />
                    <div className="gift-span">선물하기</div>
                </div>
            </li>
        </>

    );
}