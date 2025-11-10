// frontend/src/data/productData.js

import { products as crawledProducts } from "./productData.generated.js";

export const products = Array.isArray(crawledProducts) ? crawledProducts : [];
export const PRODUCT_DATA = products.reduce((acc, p) => {
  const cat = p.category || "etc";
  const sub = p.subcategory || "main";

  if (!acc[cat]) acc[cat] = {};
  if (!acc[cat][sub]) acc[cat][sub] = [];

  acc[cat][sub].push(p);
  return acc;
}, {});

export function getProductsByCategory(categoryKey, subcategoryKey) {
  const cat = PRODUCT_DATA[categoryKey];
  if (!cat) return [];

  const key = subcategoryKey || "main";

  if (cat[key]) return cat[key];
  return Object.values(cat).flat();
}

export default products;
