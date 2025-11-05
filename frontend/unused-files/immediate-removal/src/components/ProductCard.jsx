import "./ProductCard.css";

export default function ProductCard({ id, name, brand, price, img }) {
  return (
    <div className="product-card">
      <img src={img} alt={name || "상품"} />
      <div className="product-info">
        <p className="brand">{brand}</p>
        <h4 className="name">{name}</h4>
        <p className="price">{price}</p>
      </div>
    </div>
  );
}