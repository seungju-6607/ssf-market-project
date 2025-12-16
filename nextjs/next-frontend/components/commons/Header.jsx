"use client";

import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {getLogout} from "@/utils/authAPI.js";
import {getCartCount} from "@/utils/cartAPI.js";
import {FiShoppingBag} from "react-icons/fi";
import {GiShoppingCart} from "react-icons/gi";
import {useAuthStore} from "@/store/authStore.js";

export default function Header() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);
    const userId = useAuthStore((s) => s.userId);
    const role = useAuthStore((s) => s.role);
    const isLogin = useAuthStore((s) => s.isLogin);
    const accessToken = useAuthStore((s) => s.accessToken);
    const authChecked = useAuthStore((s) => s.authChecked);
    const cartCount = useAuthStore((s) => s.cartCount);
    const setCartCount = useAuthStore((s) => s.setCartCount);

    useEffect(() => {
        if (!isLogin || !userId) return; // 로그인 안 됐으면 굳이 호출 X

        const fetchCartCount = async () => { // 새로고침 -> cartCount
            const data = await getCartCount(userId);
            setCartCount(data.sumQty ?? 0);   // ✅ 여기!
        };

        fetchCartCount();
    }, [isLogin, userId]);


    const handleLogout = async() => {
        // const succ = dispatch(getLogout());
        const result = await getLogout();
        // console.log("logout-------------------", result);
        if(result.logout) {
            logout();
            alert("로그아웃 되었습니다");
            router.push("/");
        }
    }

    return (
        <div className="header-outer">
            <div className="header">
                <Link href="/" className='header-left'>
                    <FiShoppingBag />
                    <span> 🎄✨🎄 Next-Shoppy 🎄✨🎄</span>
                </Link>
                <nav className='header-right'>
                    {isLogin && <span>[{userId}::{role}]</span> }
                    <Link href="/products">Products</Link>
                    <Link href="/cart"  className="header-icons-cart-link">
                        <GiShoppingCart className='header-icons'/>
                        <span className='header-icons-cart'>{cartCount}</span>
                    </Link>
                    { authChecked && !isLogin && (
                        <Link href="/login">
                            <button type="button">Login</button>
                        </Link>
                    )}
                    { authChecked && isLogin && (
                        <button type="button"
                                onClick={handleLogout}>Logout</button>
                    )}
                    <Link href="/signup">
                        <button type="button">Signup</button>
                    </Link>
                    <Link href="/support" >
                        <button type="button">Support</button>
                    </Link>

                    {/*{ role === "ROLE_ADMIN" ?*/}
                    {/*    <Link href="/admin">*/}
                    {/*         <button type="button">Admin</button>*/}
                    {/*    </Link>*/}
                    {/*    : ''*/}
                    {/*}*/}
                </nav>
            </div>
        </div>
    );
}