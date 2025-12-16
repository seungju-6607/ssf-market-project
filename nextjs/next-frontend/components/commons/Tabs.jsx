"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Tabs( { currentTab }) {
    const tabName = 'detail';
    const tabLabels = ['DETAIL', 'REVIEW', 'Q&A', 'RETURN & DELIVERY'];
    const tabEventNames = ['detail', 'review', 'qna', 'return'];

    const router = useRouter();
    const sp = useSearchParams();

    const changeTab = (tab) => {
        const params = new URLSearchParams(sp.toString());
        params.set("tabName", tab);
        router.push("?" + params.toString()); // URL 변경 → 서버가 다시 렌더링작업 진행
    };


    return (
        <>
            <ul className='tabs'>
                { tabLabels && tabLabels.map((label, i) =>
                    <li className={currentTab === tabEventNames[i]? "active": "" } key={i}>
                        <button type="button"
                            onClick={()=> changeTab(tabEventNames[i])}
                        >{label}</button>
                    </li>
                )}
            </ul>
        </>
    );
}