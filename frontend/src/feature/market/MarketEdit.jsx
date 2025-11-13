import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOne, updateListing } from "../../feature/market/marketSlice.js";
import "./market.css";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";

const toBase64 = (file) => new Promise((res, rej) => {
  const fr = new FileReader();
  fr.onload = () => res(String(fr.result));
  fr.onerror = rej;
  fr.readAsDataURL(file);
});

export default function MarketEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.market);
  const { isAuthenticated, user } = useMarketAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("etc");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => { dispatch(fetchOne(id)); }, [id, dispatch]);
  useEffect(() => {
    if (current) {
      setTitle(current.title);
      setPrice(String(current.price));
      setCategory(current.category);
      setDescription(current.description || "");
      setImages(current.images || []);
    }
  }, [current]);

  if (!current) return <div className="mk-container"><div className="mk-empty">불러오는 중…</div></div>;

  const isOwner = isAuthenticated && (current.sellerId === (user.id || user.email));
  if (!isOwner) return <div className="mk-container"><div className="mk-empty">권한이 없습니다.</div></div>;

  const onFiles = async (files) => {
    const arr = await Promise.all([...files].slice(0, 6).map(toBase64));
    setImages((prev) => [...prev, ...arr].slice(0, 6));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const patch = {
      title: title.trim(),
      price: Number(String(price).replace(/[^\d]/g, "")) || 0,
      category, description, images,
    };
    await dispatch(updateListing({ id, patch })).unwrap();
    navigate(`/market/${id}`, { replace: true });
  };

  return (
    <div className="mk-container">
      <h2>판매글 수정</h2>
      <form className="mk-form" onSubmit={onSubmit}>
        <label>제목<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>가격(원)<input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <label>카테고리
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="fashion">패션</option>
            <option value="electronics">전자기기</option>
            <option value="life">생활/가전</option>
            <option value="hobby">취미/게임</option>
            <option value="etc">기타</option>
          </select>
        </label>
        <label>설명<textarea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        <label>이미지 추가(최대 6장)
          <input type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} />
        </label>
        {images.length > 0 && <div className="mk-previews">{images.map((src, i) => <img key={i} src={src} alt={`img-${i}`} />)}</div>}

        <div className="mk-form-actions">
          <button className="mk-btn" type="button" onClick={() => navigate(-1)}>취소</button>
          <button className="mk-btn primary" type="submit">저장</button>
        </div>
      </form>
    </div>
  );
}
