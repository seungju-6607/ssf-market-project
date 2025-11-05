export const toNumber = (v) =>
  typeof v === "string" ? Number(v.replace(/[^\d]/g, "")) || 0 : Number(v || 0);

export const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;
