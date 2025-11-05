// src/utils/srcOf.js
export function srcOf(raw) {
  if (!raw) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${process.env.PUBLIC_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
}
