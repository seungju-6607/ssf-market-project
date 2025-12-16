"use client";

import {use} from "react";
import {useRouter} from "next/navigation";

export default function PayResult(props) {
    const router = useRouter();
    const searchParams = use(props.searchParams);
    const { orderId, status, userId } = searchParams || {};

    return (
        <div style={{padding: "3rem" }}>
            <h2>결제 결과 페이지</h2>
            <p><b>주문번호:</b> {orderId}</p>
            <p><b>결제 상태:</b> {status}</p>

            {status === "success" ? (
                <p style={{ color: "green" }}>✅ 결제가 정상적으로 완료되었습니다!</p>
            ) : (
                <p style={{ color: "red" }}>❌ 결제에 실패했습니다.</p>
            )}
            <div style={{padding: "1rem"}}>
                <button onClick={()=> router.push("/")}>홈으로 이동</button>
            </div>
        </div>
    );
}