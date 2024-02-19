import React, { useState } from "react";
import LecturePaymentList from "./lecturePaymentList/LecturePaymentList";
import ProductPaymentList from "./productPaymentList/ProductPaymentList";
import "./style.scss";
const PaymentList = () => {
  const [selectedTab, setSelectedTab] = useState("lecture"); // 현재 선택된 탭을 추적합니다.

  return (
    <div className="cart"> 
      <div className="cart-title">결제내역</div>
      <div>
        <span className="lecture-tab" onClick={() => setSelectedTab("lecture")}>
          강의
        </span>
        <span className="product-tab" onClick={() => setSelectedTab("product")}>
          상품
        </span>
      </div>
      {selectedTab === "lecture" && <LecturePaymentList />}{" "}
      {selectedTab === "product" && <ProductPaymentList />}{" "}
    </div>
  );
};

export default PaymentList;
