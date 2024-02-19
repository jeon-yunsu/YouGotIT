import React, { useState } from "react";
import LectureCart from "./lectureCart/LectureCart"; // LectureCart 컴포넌트를 import 합니다.
import ProductCart from "./productCart/ProductCart"; // ProductCart 컴포넌트를 import 합니다.
import "./style.scss";
const Cart = () => {
  const [selectedTab, setSelectedTab] = useState("lecture"); // 현재 선택된 탭을 추적합니다.

  return (
    <div className="cart">
      <div className="cart-title">장바구니</div>
      <div>
        <span className="lecture-tab" onClick={() => setSelectedTab("lecture")}>
          강의
        </span>
        <span className="product-tab" onClick={() => setSelectedTab("product")}>
          상품
        </span>
      </div>
      {selectedTab === "lecture" && <LectureCart />}{" "}
      {selectedTab === "product" && <ProductCart />}{" "}
    </div>
  );
};

export default Cart;
