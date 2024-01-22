import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";

const Cart = ({ cart }) => {
  const [cartItems, setCartItems] = useState(Array.isArray(cart) ? cart : []);

  // 총 가격 계산
  const totalAmount = cartItems.reduce((total, item) => total + item.price, 0);

  // 아이템 제거 함수
  const removeItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  return (
    <div className="wrap cf">
      <div className="heading cf">
        <div className="cart-title">장바구니</div>
      </div>
      <div className="cart">
        <ul className="cartWrap">
          {cartItems.map((item, index) => (
            <li key={index} className={`items ${index % 2 === 0 ? "even" : "odd"}`}>
              <div className="infoWrap">
                <div className="cartSection">
                  <img src={item.imageSrc} alt="" className="itemImg" />
                  <h3>{item.title}</h3>
                  <p className="cart-instructor">{item.instructor}</p>
                </div>
                <div className="prodTotal cartSection">
                  <p>{item.price}원</p>
                </div>
                <div className="cartSection removeWrap">
                  <a href="#" className="remove" onClick={() => removeItem(index)}>
                    x
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="subtotal cf">
        <ul>
          <li className="totalRow final">
            <span className="label">총 결제금액</span>
            <span className="value">{totalAmount}원</span>
          </li>

          <li className="totalRow">
            <a href="#" className="btn continue">
              결제하기
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Cart;
