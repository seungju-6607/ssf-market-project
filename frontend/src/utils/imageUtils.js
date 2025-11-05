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
