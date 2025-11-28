import React, { useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOne, updateListing } from "../../feature/market/marketSlice.js";
import "./market.css";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";
import { fileToBase64, uploadImagesToServer } from "../../utils/imageUtils.js";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

export default function MarketEdit() {
  const { fleaKey } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { current } = useSelector((s) => s.market);
  const { isAuthenticated, user } = useMarketAuth();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("etc");
  const [description, setDescription] = useState("");

  // 이미지 관리
  const [savedKeys, setSavedKeys] = useState([]);         // 기존 DB key
  const [savedPreviews, setSavedPreviews] = useState([]); // 서버 URL
  const [selectedFiles, setSelectedFiles] = useState([]); // 새 업로드 File[]
  const [imagePreviews, setImagePreviews] = useState([]); // base64

  // 삭제 예정 이미지
  const [toDeleteKeys, setToDeleteKeys] = useState([]); // 서버 삭제 대상

  // 판매자 정보
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchOne(fleaKey)); }, [fleaKey, dispatch]);

  useEffect(() => {
    if (!current) return;

    setTitle(current.fleaTitle);
    setPrice(String(current.fleaPrice));
    setCategory(current.fleaCategory);
    setDescription(current.fleaContent || "");

    // 🔥 DB 저장된 이미지 key 배열
    const keys = current.fleaList ? JSON.parse(current.fleaList) : [];

    // 🔥 실제 서버 URL 붙여 미리보기용으로 변환

    const urls = keys.map((key) => `${BACKEND_URL}/uploads/${key}`);
    console.log("urls -> ", urls);
    setSavedKeys(keys);       // 저장된 파일명 key
    setSavedPreviews(urls);   // 미리보기용 URL

    setSellerName(current.sellerName || user?.name || "");
    setSellerEmail(current.sellerEmail || user?.email || "");
  }, [current]);


  if (!current) return <div className="mk-container"><div className="mk-empty">불러오는 중…</div></div>;

  const isOwner = isAuthenticated && (current.fleaId === (user.id || user.email));
  if (!isOwner) return <div className="mk-container"><div className="mk-empty">권한이 없습니다.</div></div>;

  const onFiles = async (files) => {
    const remain = 6 - (savedKeys.length + selectedFiles.length);
    if (remain <= 0) return alert("이미지는 최대 6장까지 등록할 수 있습니다.");

    const list = [...files].slice(0, remain);
    setSelectedFiles((prev) => [...prev, ...list]);

    const previews = await Promise.all(list.map(fileToBase64));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const onDeleteImage = (index, type) => {
    if (type === "saved") {
      const keyToRemove = savedKeys[index];
      setSavedKeys((prev) => prev.filter((_, i) => i !== index));
      setSavedPreviews((prev) => prev.filter((_, i) => i !== index));

      setToDeleteKeys((prev) => [...prev, keyToRemove]); // 서버에서 삭제할 키 저장
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const titleTrim = title.trim();
    if (!titleTrim) return alert("제목을 입력해주세요.");

    const priceNum = toNumber(price);
    if (priceNum < 0) return alert("가격은 0원 이상이어야 합니다.");

    if (!sellerName.trim()) return alert("판매자 이름을 입력해주세요.");
    if (sellerEmail && !isEmail(sellerEmail))
      return alert("이메일 형식이 올바르지 않습니다.");

    setSubmitting(true);

    try {
      if (toDeleteKeys.length > 0) {
        const csrfToken = document.cookie
          .split("; ")
          .find(row => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];

        await axios.delete(`${BACKEND_URL}/market/delete`, {
          headers: { "X-XSRF-TOKEN": csrfToken },
          withCredentials: true,   // 쿠키 세션 사용
          data: { keys: toDeleteKeys },
        });

        setToDeleteKeys([]); // 삭제 완료 후 초기화
      }

      const newKeys = await uploadImagesToServer(selectedFiles);

      const allKeys = [...savedKeys, ...newKeys];

      const patch = {
        title: titleTrim,
        price: priceNum,
        category,
        description,
        images: JSON.stringify(allKeys),
        sellerName: sellerName.trim(),
        sellerEmail: sellerEmail.trim(),
        updatedAt: new Date().toISOString(),
      };

      await dispatch(updateListing({ fleaKey, patch })).unwrap();

      alert("정상적으로 수정되었습니다.");
      navigate(`/market/${fleaKey}`, { replace: true });
    } catch (err) {
      console.error("판매글 수정 에러:", err);
      alert("수정 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mk-container">
      <h2>판매글 수정</h2>
      <form className="mk-form" onSubmit={onSubmit}>
        <label>제목<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>가격(원)<input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={() => setPrice(String(toNumber(price)))} /></label>
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
        <label>
          이미지(최대 6장)
          <div className="mk-file-input-wrapper">
            <button
              type="button"
              className="mk-file-input-button"
              onClick={() => fileInputRef.current.click()}
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
                e.target.value = "";
              }}
            />
          </div>
        </label>

        {/* 기존 이미지 */}
        {savedPreviews.length > 0 && (
          <>
            <div style={{ marginTop: 6, fontWeight: "bold" }}>기존 이미지</div>
            <div className="mk-previews">
              {savedPreviews.map((src, i) => (
                <div key={i} className="mk-preview-item">
                  <img className="mk-preview-img" src={src} alt={`saved-${i}`} />
                  <button
                    type="button"
                    className="mk-preview-delete"
                    onClick={() => onDeleteImage(i, "saved")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 신규 이미지 미리보기 */}
        {imagePreviews.length > 0 && (
          <>
            <div style={{ marginTop: 6, fontWeight: "bold" }}>추가된 이미지</div>
            <div className="mk-previews">
              {imagePreviews.map((src, i) => (
                <div key={i} className="mk-preview-item">
                  <img className="mk-preview-img" src={src} alt={`new-${i}`} />
                  <button
                    type="button"
                    className="mk-preview-delete"
                    onClick={() => onDeleteImage(i, "new")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mk-form-actions">
          <button className="mk-btn" type="button" onClick={() => navigate(-1)}>취소</button>
          <button className="mk-btn primary" type="submit">저장</button>
        </div>
      </form>
    </div>
  );
}
