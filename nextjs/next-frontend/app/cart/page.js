"use client";

import {useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import {showCart, updateCart, removeCart, getCartCount} from '@/utils/cartAPI.js';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {useAuthStore} from "@/store/authStore.js";
import Link from 'next/link';

export default function Cart() {
    const router = useRouter();
    const [cartList, setCartList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [updateFlag, setUpdateFlag] = useState(false);
    const userId = useAuthStore((s) => s.userId);
    const setCartCount = useAuthStore((s) => s.setCartCount);

    useEffect(()=> {
        const fetch = async(userId) => {
            const list = await showCart(userId);
            console.log("list-----------------------> ", list);
            setCartList(list);
            if(list.length > 0) setTotalPrice(list[0].totalPrice);
            const { sumQty } = await getCartCount(userId);
            setCartCount(sumQty);
        }
        fetch(userId);
    }, [updateFlag]);

    const handleUpdateQty = async(cid, type) => {
        const result = await updateCart(cid, type);
        if(result) setUpdateFlag(!updateFlag);
    }

    const handleDeleteQty = async(cid) => {
        const result = await removeCart(cid);
        console.log("handleDeleteQty :: result-------------",result);
        if(result) await setUpdateFlag(!updateFlag);
    }

    return (
        <div className='cart-container'>
            <h2 className='cart-header'>장바구니</h2>
            { cartList && cartList.map(item =>
                <div key={item.cid}>
                    <div className='cart-item'>
                        <img src={`/images/${item.image}`} alt="product img" />
                        <div className='cart-item-details'>
                            <p className='cart-item-title'>{item.name}</p>
                            <p className='cart-item-title'>{item.size}</p>
                            <p className='cart-item-price'>
                                {parseInt(item.price).toLocaleString()}원</p>
                        </div>
                        <div className='cart-quantity'>
                            <button type='button'
                                    onClick={()=>{item.qty > 1 && handleUpdateQty(item.cid, "-")}}>-</button>
                            <input type='text' value={item.qty} readOnly/>
                            <button type='button'
                                    onClick={()=>{handleUpdateQty(item.cid, "+")}}>+</button>
                        </div>
                        <button className='cart-remove'
                                onClick={()=>{handleDeleteQty(item.cid)}}>
                            <RiDeleteBin6Line />
                        </button>
                    </div>
                </div>
            )}

            {/* 주문 버튼 출력 */}
            { cartList && cartList.length > 0 ?
                <>
                    <div className='cart-summary'>
                        <h3>주문 예상 금액</h3>
                        <div className='cart-summary-sub'>
                            <p className='cart-total'>
                                <label>총 상품 가격 : </label>
                                <span>{totalPrice.toLocaleString()}원</span>
                            </p>
                            <p className='cart-total'>
                                <label>총 할인 가격 : </label>
                                <span>0원</span>
                            </p>
                            <p className='cart-total'>
                                <label>총 배송비 : </label>
                                <span>0원</span>
                            </p>
                        </div>
                        <p className='cart-total2'>
                            <label>총 금액 : </label>
                            <span>{Number(totalPrice).toLocaleString()}원</span>
                        </p>
                    </div>
                    <div className='cart-actions'>
                        <button type='button'
                                onClick={()=>{
                                    router.push("/checkout");
                                }}>주문하기</button>
                    </div>
                </>
                :  <div>
                    <p> 장바구니에 담은 상품이 없습니다. &nbsp;&nbsp;&nbsp;&nbsp;
                        <Link href="/products">상품보러가기</Link>
                    </p>
                    <img src="/images/cart.jpg"
                         style={{width:"50%", marginTop:"20px"}} />
                </div>
            }
        </div>
    );
}

