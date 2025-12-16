"use client";

import { useState} from "react";

export default function ItemContent ({ item }) {
    const [openQid, setOpenQid] = useState(null);
    const handleToggle = (qid) => {
        setOpenQid(prev => (prev === qid) ? null : qid);
    }

    return (
        <>
            <span style={{cursor:"pointer"}}
                onClick={()=> {handleToggle(item.qid)}}
            >{item.title}</span>
            {item.isLock && <span>비밀글</span>}
            {openQid === item.qid && <span>{item.content}</span>}
        </>
    );
}
