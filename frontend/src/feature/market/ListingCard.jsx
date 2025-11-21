import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./market.card.css";
import { getImageFromIndexedDB, parseFleaList } from "../../utils/imageUtils.js";

const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function ListingCard({ item }) {
  const [imageUrl, setImageUrl] = useState(null); // 이미지 URL 상태
//   const thumb = item.images?.[0] || `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
  useEffect(() => {
    const fetchImages = async () => {
      if (item.fleaList && item.fleaList.length > 0) {
        const fleaList = parseFleaList(item.fleaList); // fleaList를 배열로 변환
        if (fleaList.length > 0) {
          const firstImageKey = fleaList[0]; // 첫 번째 이미지 키
          const url = await getImageFromIndexedDB(firstImageKey); // 첫 번째 이미지의 URL을 가져옴
          setImageUrl(url); // 상태에 이미지 URL 저장
        }
      }
    };

      fetchImages();
    }, [item.fleaList]); // fleaList가 변경될 때마다 실행

  return (
    <Link to={`/market/${item.fleaKey}`} className={`mk-card ${item.status === "SOLD" ? "sold" : ""}`}>
      <div className="mk-card-img">
        {imageUrl ? (
          <img src={imageUrl} alt={`Image for ${item.fleaTitle}`} />
        ) : (
          <span className="mk-card-list-placeholder">이미지 미리보기 없음</span>
        )}
        {item.fleaSale=== "Y" && <span className="mk-badge">판매완료</span>}
      </div>
      <div className="mk-card-body">
        <div className="mk-title">{item.fleaTitle}</div>
        <div className="mk-price">{fmt(item.fleaPrice)}</div>
        <div className="mk-meta">
          {item.fleaName} · {new Date(item.fleaRdate).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
