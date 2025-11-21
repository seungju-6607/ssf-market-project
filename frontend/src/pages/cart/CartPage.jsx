// src/pages/cart/CartPage.jsx
import "./CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";
import { showCart, removeCart, updateCartQty } from "../../feature/cart/cartAPI.js";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartList = useSelector((state) => state.cart.cartList || []);
  const totalSaleAmount = useSelector((state) => state.cart.totalSaleAmount || 0);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin") === "true";
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(showCart());
  }, [dispatch]);

  useEffect(() => {
    const initSel = {};
    cartList.forEach((item) => {
      initSel[item.cartKey] = true;
    });
    setSelected(initSel);
  }, [cartList]);

  const toggleOne = (cartKey) =>
    setSelected((prev) => ({ ...prev, [cartKey]: !prev[cartKey] }));

  const allChecked = useMemo(
    () => cartList.length > 0 && cartList.every((item) => selected[item.cartKey]),
    [cartList, selected]
  );

  const toggleAll = () => {
    const next = {};
    cartList.forEach((item) => {
      next[item.cartKey] = !allChecked;
    });
    setSelected(next);
  };

  const parseImage = (itemList) => {
    if (!itemList) return "/images/placeholder.png";
    try {
      const parsed = JSON.parse(itemList);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch (error) {
      console.warn("Failed to parse itemList", error);
    }
    return "/images/placeholder.png";
  };

  const unitPrice = (item) => {
    if (!item) return 0;
    if (typeof item.itemSale === "number") return item.itemSale;
    if (typeof item.itemPrice === "number") return item.itemPrice;
    const price = item.itemSale ?? item.itemPrice;
    if (!price) return 0;
    return Number(String(price).replace(/[^\d]/g, "")) || 0;
  };

  const linePrice = (item) => {
    if (!item) return 0;
    if (typeof item.lineTotalSale === "number") return item.lineTotalSale;
    if (typeof item.lineTotalPrice === "number") return item.lineTotalPrice;
    return unitPrice(item) * (item.cartQty || 0);
  };

  /* 장바구니 아이템 선택 */
  const selectedItems = useMemo(
    () => cartList.filter((item) => selected[item.cartKey]),
    [cartList, selected]
  );

  const proceed = () => {
    if (selectedItems.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    const payload = selectedItems.map((item) => ({
      id: item.cartKey,
      name: item.itemName,
      image: parseImage(item.itemList),
      price: unitPrice(item),
      qty: item.cartQty,
      size: item.cartSize,
    }));

    localStorage.setItem("cartCheckout", JSON.stringify(payload));
    localStorage.setItem("orderSource", "cart");
    localStorage.removeItem("directCheckout");
    navigate("/checkout", { state: { fromCart: true } });
  };

  /* 장바구니 선택 삭제 */
  const deleteSelectedItems = async () => {
    if(selectedItems.length === 0) {
        alert("삭제할 상품을 선택해주세요.");
        return;
    }
    const cartKeys = selectedItems.map(item => item.cartKey);
    await dispatch(removeCart(cartKeys));
  }

  return (
    <div className="cart-wrap">
      <h1 className="cart-title">장바구니</h1>

      {cartList.length === 0 ? (
        <div className="cart-empty">
          <p>장바구니가 비어 있습니다.</p>
          <Link to="/" className="btn">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-head">
            <label className="chk">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
              />
              <span>전체선택</span>
            </label>
            <div className="cart-head-actions">
              <button className="btn"
                      onClick={deleteSelectedItems}
                      disabled={selectedItems.length === 0}>
                선택삭제
              </button>
            </div>
          </div>

          <div className="cart-list">
            {cartList.map((item) => {
              const unit = unitPrice(item);
              const sub = linePrice(item);
              const imgSrc = parseImage(item.itemList);

              return (
                <div className="cart-item" key={item.cartKey}>
                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={!!selected[item.cartKey]}
                      onChange={() => toggleOne(item.cartKey)}
                    />
                  </label>

                  <img
                    className="cart-img"
                    src={imgSrc}
                    alt={item.itemName}
                  />

                  <div className="cart-info">
                    <div className="cart-name">{item.itemName}</div>
                    <div className="cart-meta">사이즈: {item.cartSize}</div>
                    <div className="cart-meta">
                      단가: ₩{unit.toLocaleString()}
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button type="button" onClick={() => {item.cartQty > 1 && dispatch(updateCartQty(item.cartKey, "-"))}}>
                      -
                    </button>
                    <input type="text" value={item.cartQty} readOnly />
                    <button type="button" onClick={() => { dispatch(updateCartQty(item.cartKey, "+"))}}>
                      +
                    </button>
                  </div>

                  <div className="cart-sub">
                    ₩{sub.toLocaleString()}
                  </div>

                  <button className="btn-danger" onClick={() => { dispatch(removeCart(item.cartKey))}}>
                    삭제
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-sum-row">
              <span>선택 상품 금액</span>
              <b>₩{totalSaleAmount.toLocaleString()}</b>
            </div>
            <div className="cart-actions">
              <Link to="/" className="btn">
                쇼핑 계속하기
              </Link>
              <button className="pay-btn" onClick={proceed}>
                선택 상품 결제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
