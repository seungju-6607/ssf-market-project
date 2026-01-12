import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOne, updateListing } from "../../feature/market/marketSlice.js";
import "./market.css";
import { useNavigate, useParams } from "react-router-dom";
import { useMarketAuth } from "./authBridge.js";
import { fileToBase64, uploadImagesToServer } from "../../utils/imageUtils.js";
import axiosJWT from "../../api/axiosJWT.js";

const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

const toNumber = (v) =>
  typeof v === "number"
    ? v
    : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

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

  // 이미지 상태
  const [savedKeys, setSavedKeys] = useState([]);
  const [savedPreviews, setSavedPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [toDeleteKeys, setToDeleteKeys] = useState([]);

  // 판매자
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  /* =========================
   * 데이터 로드
   * ========================= */
  useEffect(() => {
    dispatch(fetchOne(fleaKey));
  }, [fleaKey, dispatch]);

  useEffect(() => {
    if (!current) return;

    setTitle(current.fleaTitle);
    setPrice(String(current.fleaPrice));
    setCategory(current.fleaCategory);
    setDescription(current.fleaContent || "");

    const keys = current.fleaList ? JSON.parse(current.fleaList) : [];
    setSavedKeys(keys);

    // 서버 업로드 이미지 미리보기 URL
    const urls = keys.map((key) => `/uploads/${key}`);
    setSavedPreviews(urls);

    setSellerName(current.sellerName || user?.name || "");
    setSellerEmail(current.sellerEmail || user?.email || "");
  }, [current, user]);

  if (!current) {
    return (
      <div className="mk-container">
        <div className="mk-empty">불러오는 중…</div>
      </div>
    );
  }

  const isOwner =
    isAuthenticated && current.fleaId === (user?.id || user?.email);

  if (!isOwner) {
    return (
      <div className="mk-container">
        <div className="mk-empty">권한이 없습니다.</div>
      </div>
    );
  }

  /* =========================
   * 파일 선택
   * ========================= */
  const onFiles = async (files) => {
    const remain = 6 - (savedKeys.length + selectedFiles.length);
    if (remain <= 0) {
      alert("이미지는 최대 6장까지 등록할 수 있습니다.");
      return;
    }

    const list = [...files].slice(0, remain);
    setSelectedFiles((prev) => [...prev, ...list]);

    const previews = await Promise.all(list.map(fileToBase64));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  /* =========================
   * 이미지 삭제
   * ========================= */
  const onDeleteImage = (index, type) => {
    if (type === "saved") {
      const keyToRemove = savedKeys[index];
      setSavedKeys((prev) => prev.filter((_, i) => i !== index));
      setSavedPreviews((prev) => prev.filter((_, i) => i !== index));
      setToDeleteKeys((prev) => [...prev, keyToRemove]);
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /* =========================
   * 수정 제출
   * ========================= */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!title.trim()) return alert("제목을 입력해주세요.");
    const priceNum = toNumber(price);
    if (priceNum < 0) return alert("가격은 0원 이상이어야 합니다.");
    if (!sellerName.trim()) return alert("판매자 이름을 입력해주세요.");
    if (sellerEmail && !isEmail(sellerEmail))
      return alert("이메일 형식이 올바르지 않습니다.");

    setSubmitting(true);

    try {
      // 🔥 삭제 이미지 서버 반영 (JWT)
      if (toDeleteKeys.length > 0) {
        await axiosJWT.delete("/market/delete", {
          data: { keys: toDeleteKeys },
        });
        setToDeleteKeys([]);
      }

      // 🔥 신규 이미지 업로드
      const newKeys = await uploadImagesToServer(selectedFiles);
      const allKeys = [...savedKeys, ...newKeys];

      const patch = {
        title: title.trim(),
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

  /* =========================
   * 렌더
   * ========================= */
  return (
    <div className="mk-container">
      <h2>판매글 수정</h2>
      <form className="mk-form" onSubmit={onSubmit}>
        <label>
          제목
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          가격(원)
          <input
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => setPrice(String(toNumber(price)))}
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
          />
        </label>

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
            <div className="mk-section-title">기존 이미지</div>
            <div className="mk-previews">
              {savedPreviews.map((src, i) => (
                <div key={i} className="mk-preview-item">
                  <img className="mk-preview-img" src={src} alt="" />
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

        {/* 신규 이미지 */}
        {imagePreviews.length > 0 && (
          <>
            <div className="mk-section-title">추가된 이미지</div>
            <div className="mk-previews">
              {imagePreviews.map((src, i) => (
                <div key={i} className="mk-preview-item">
                  <img className="mk-preview-img" src={src} alt="" />
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
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
          <button className="primary" type="submit">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
