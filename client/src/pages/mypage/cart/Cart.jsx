import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import jsCookie from "js-cookie";
import lectureDefaultImage from "../../../img/lectureDefaultImage.png";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Initialize as an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");

        const response = await axios.get(`${baseUrl}/api/cart/cartlist`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(response.data); // Assuming the response is an array
      } catch (error) {
        console.error("프로필 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  // 총 가격 계산
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.LecturePrice,
    0
  );

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
            <li
              key={index}
              className={`items ${index % 2 === 0 ? "even" : "odd"}`}
            >
              <div className="infoWrap">
                <div className="cartSection">
                  {item.LectureImageURL ? (
                    <img
                      src={item.LectureImageURL}
                      alt=""
                      className="itemImg"
                    />
                  ) : (
                    <img
                      src={lectureDefaultImage}
                      alt="Default Lecture Image"
                      className="itemImg"
                    />
                  )}
                  <h3>{item.Title}</h3>
                  <p className="cart-instructor">{item.InstructorName}</p>
                </div>
                <div className="prodTotal cartSection">
                  <p>{item.LecturePrice}원</p>
                </div>
                <div className="cartSection removeWrap">
                  <a
                    href="#"
                    className="remove"
                    onClick={() => removeItem(index)}
                  >
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
