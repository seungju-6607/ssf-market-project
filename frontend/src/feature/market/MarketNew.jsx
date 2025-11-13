// src/feature/market/MarketNew.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createListing } from "./marketSlice.js";
import "./market.css";
import { useNavigate } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";

const toBase64 = (file) =>
  new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

export default function MarketNew() {
  const { isAuthenticated, user } = useMarketAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // 원문 그대로 문자열 입력 받음
  const [category, setCategory] = useState("etc");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [sellerName, setSellerName] = useState(user?.name || "");
  const [sellerEmail, setSellerEmail] = useState(user?.email || "");
  const [submitting, setSubmitting] = useState(false);

  const onFiles = async (files) => {
    try {
      const list = [...files].slice(0, 6 - images.length);
      if (list.length === 0) return;
      const arr = await Promise.all(list.map(toBase64));
      setImages((prev) => [...prev, ...arr].slice(0, 6));
    } catch {
      alert("이미지 파일을 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const titleTrim = title.trim();
    if (!titleTrim) return alert("제목을 입력해주세요.");

    const priceNum = toNumber(price);
    if (priceNum < 0) return alert("가격은 0원 이상이어야 합니다.");

    // 비로그인 사용자는 이름/이메일 반드시 필요
    if (!isAuthenticated) {
      if (!sellerName.trim()) return alert("판매자 이름을 입력해주세요.");
      if (!isEmail(sellerEmail)) return alert("연락 가능한 이메일을 올바르게 입력해주세요.");
    } else {
      // 로그인 사용자도 수동 입력 시 형식 체크
      if (sellerEmail && !isEmail(sellerEmail)) {
        return alert("연락 이메일 형식이 올바르지 않습니다.");
      }
    }

    const payload = {
      title: titleTrim,
      price: priceNum,
      category,
      description,
      images,
      sellerId: (user?.id || user?.email) ?? `guest:${Date.now()}`,
      sellerName: sellerName.trim() || user?.name || (user?.email ? user.email.split("@")[0] : "USER"),
      sellerEmail: (sellerEmail || user?.email || "").trim(),
      createdAt: new Date().toISOString(),
      status: "FOR_SALE",
    };

    try {
      setSubmitting(true);
      const result = await dispatch(createListing(payload)).unwrap();
      navigate(`/market/${result.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      alert("등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mk-container">
      <h2>판매글 올리기</h2>
      <form className="mk-form" onSubmit={onSubmit}>
        <label>
          제목
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 에잇세컨즈 니트 가디건 새상품"
            maxLength={80}
          />
        </label>

        <label>
          가격(원)
          <input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => setPrice(String(toNumber(price)))}
            placeholder="예) 20000"
          />
        </label>

        <label>
          카테고리
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="fashion">패션</option>
            <option value="electronics">전자기기</option>
            <option value="life">생활/가전</option>
            <option value="hobby">취미/게임</option>
            <option value="etc">기타</option>
          </select>
        </label>

        <label>
          설명
          <textarea
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="상품 상태, 사용 기간, 교환/네고 가능 여부 등을 적어주세요."
          />
        </label>

        <div style={{ borderTop: "1px solid #eee", marginTop: 8, paddingTop: 8 }}>
          <strong>판매자 연락 정보</strong>
          <label>
            판매자 이름
            <input
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="예) 홍길동"
            />
          </label>
          <label>
            연락 이메일 {isAuthenticated ? "(선택)" : "(비로그인 시 필수)"}
            <input
              type="email"
              value={sellerEmail}
              onChange={(e) => setSellerEmail(e.target.value)}
              placeholder="예) user@example.com"
            />
          </label>
          {!isAuthenticated && (
            <small style={{ color: "#777" }}>
              ※ 비로그인 작성은 연락 이메일이 꼭 필요합니다.
            </small>
          )}
        </div>

        <label>
          이미지(최대 6장)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
        {images.length > 0 && (
          <div className="mk-previews">
            {images.map((src, i) => (
              <img key={i} src={src} alt={`img-${i}`} />
            ))}
          </div>
        )}

        <div className="mk-form-actions">
          <button className="mk-btn" type="button" onClick={() => navigate(-1)} disabled={submitting}>
            취소
          </button>
          <button className="mk-btn primary" type="submit" disabled={submitting}>
            {submitting ? "등록 중…" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
