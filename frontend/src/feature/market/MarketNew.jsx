// src/feature/market/MarketNew.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createListing } from "./marketSlice.js";
import { getCreatePost } from "./marketAPI.js";
import "./market.css";
import { useNavigate } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";
import { saveImageToIndexedDB, getImageFromIndexedDB, deleteImageFromIndexedDB } from "../../utils/imageUtils.js";

// const toBase64 = (file) =>
//   new Promise((res, rej) => {
//     const fr = new FileReader();
//     fr.onload = () => res(String(fr.result));
//     fr.onerror = rej;
//     fr.readAsDataURL(file);
//   });

// Base64 변환 (PNG, JPG, GIF 등)
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!(file instanceof File)) return reject(new Error("File 타입이 아닙니다."));
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Base64 변환 실패"));
    };
    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsDataURL(file);
  });

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

export default function MarketNew() {
  const { isAuthenticated, user } = useMarketAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); // 원문 그대로 문자열 입력 받음
  const [category, setCategory] = useState("etc");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // base64 형식 이미지 미리보기 배열
  const [sellerName, setSellerName] = useState(user?.name || "");
  const [sellerEmail, setSellerEmail] = useState(user?.email || "");
  const [submitting, setSubmitting] = useState(false);

  // 파일 선택 후 base64로 변환해서 IndexedDB에 저장
  const onFiles = async (files) => {
    setImagePreviews([]); // 미리보기 초기화

    try {
      const list = [...files].slice(0, 6 - images.length);
      const keys = await Promise.all(
        list.map(async (file) => {
          const base64 = await toBase64(file);
          const key = Date.now() + Math.random().toString(36).slice(2); // 고유 키 생성
          await saveImageToIndexedDB(key, base64); // IndexedDB에 이미지 저장
          return key; // key 반환
        })
      );
      setImages(keys); // 새로 선택한 파일만 저장
    } catch (error) {
      alert("이미지 파일을 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const fetchPreviews = async () => {
      if (!images.length) {
        setImagePreviews([]);
        return;
      }
      try {
        const previews = await Promise.all(
          images.map(async (key) => {
            const base64 = await getImageFromIndexedDB(key);
            return base64 || ""; // null이면 빈 문자열로
          })
        );
        setImagePreviews(previews);
      } catch (err) {
        console.error("이미지 불러오기 실패", err);
        setImagePreviews([]);
      }
    };
    fetchPreviews();
  }, [images]);

  // 이미지 삭제
  const onDeleteImage = async (key) => {
    try {
      await deleteImageFromIndexedDB(key);
      setImages((prev) => prev.filter((k) => k !== key));
    } catch (err) {
      console.error("이미지 삭제 실패", err);
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
      images: JSON.stringify(images),
      sellerId: (user?.id || user?.email) ?? `guest:${Date.now()}`,
      sellerName: sellerName.trim() || user?.name || (user?.email ? user.email.split("@")[0] : "USER"),
      sellerEmail: (sellerEmail || user?.email || "").trim(),
      createdAt: new Date().toISOString(),
      status: "FOR_SALE",
    };

    try {
      const postResult = await dispatch(createListing(payload)).unwrap();
      if (postResult == 1)
      setSubmitting(true);
      alert("정상적으로 등록되었습니다.");
      navigate("/market");
    } catch (postErr) {
      setSubmitting(false);
      console.error("판매글 등록 에러:", postErr);
      alert("판매글 등록 중 오류가 발생했습니다.");
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

        {/* 이미지 파일 선택 */}
        <label>
          이미지(최대 6장)
          <div className="mk-file-input-wrapper">
            <button
              type="button"
              className="mk-file-input-button"
              onClick={() => {
                // 클릭 시 기존 이미지 초기화
                setImagePreviews([]);
                setImages([]);
                fileInputRef.current.click();
              }}
            >
              파일 선택
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="mk-file-input"
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = ""; // 같은 파일 재선택 시 이벤트 발생
              }}
            />
          </div>
        </label>

        {/* 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="mk-previews">
            {imagePreviews.map((src, i) => (
             <div key={i} className="mk-preview-item">
               <img className="mk-preview-img" src={src || ""} alt={`img-${i}`} />
               <button type="button" className="mk-preview-delete" onClick={() => onDeleteImage(images[i])}>
                 ×
               </button>
             </div>
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
