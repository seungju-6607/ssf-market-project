export default function handler(req, res) {
  const products = [
    { id: 1, name: "상품1", price: 1000 },
    { id: 2, name: "상품2", price: 2000 }
  ];
  res.status(200).json(products);
}
