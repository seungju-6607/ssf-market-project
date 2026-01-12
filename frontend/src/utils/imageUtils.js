import axiosJWT from "../api/axiosJWT.js";

/**
 * 이미지 src 생성 유틸
 * - 외부 URL 그대로
 * - 상대경로는 PUBLIC_URL 기준
 * - 한글 인코딩 처리
 */
export const srcOf = (item) => {
  const raw =
    typeof item === "string" ? item : item?.img || item?.image || "";

  // 누락 시 플레이스홀더
  if (!raw) return `${process.env.PUBLIC_URL}/images/placeholder.png`;

  // 외부 URL이면 그대로
  if (/^https?:\/\//i.test(raw)) return raw;

  // /images/... 형식이든 상대경로든 PUBLIC_URL 기준 절대경로 + 한글 인코딩
  const cleaned = raw.startsWith("/") ? raw : `/${raw}`;
  return `${process.env.PUBLIC_URL}${encodeURI(cleaned)}`;
};

/**
 * 파일 객체를 base64 문자열로 변환 (미리보기용)
 * @param {File} file
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Base64 변환 실패"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * 선택된 이미지 파일 배열을 서버에 업로드 (JWT 인증)
 * @param {File[]} files
 * @returns {Promise<string[]>} 서버에서 반환한 key 배열
 */
export const uploadImagesToServer = async (files) => {
  if (!files || files.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  // 🔑 axiosJWT 사용 → Authorization: Bearer 자동 첨부
  const res = await axiosJWT.post("/market/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res || res.status !== 200) {
    throw new Error("이미지 업로드 실패");
  }

  return res.data?.keys || [];
};
