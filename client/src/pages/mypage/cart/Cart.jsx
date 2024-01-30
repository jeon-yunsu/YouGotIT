import React, { useState, useEffect } from "react";
import axios from "axios";
import jsCookie from "js-cookie";
import { baseUrl } from "../../../config/baseUrl";
import lectureDefaultImage from "../../../img/lectureDefaultImage.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
// import { useLocation } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
        setCartItems(response.data);
      } catch (error) {
        console.error("장바구니 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const totalAmount = selectedItems.reduce((total, selectedIndex) => {
    const selectedItem = cartItems[selectedIndex];

    // 만약 선택한 항목이 유효하다면 해당 항목의 LecturePrice를 누적합니다.
    if (selectedItem && selectedItem.LecturePrice) {
      return total + selectedItem.LecturePrice;
    }

    // 그렇지 않으면 누적값을 그대로 반환합니다.
    return total;
  }, 0);

  const formattedTotalAmount = totalAmount.toLocaleString();

  const selectedRemoveItem = async (index) => {
    try {
      const lectureIds = selectedItems
        .map((selectedIndex) => cartItems[selectedIndex]?.LectureID)
        .filter(Boolean);
      const deletePromises = lectureIds.map(async (id) => {
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            LectureID: id,
          },
          {
            withCredentials: true,
          }
        );
      });

      await Promise.all(deletePromises);

      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => item !== index)
      );

      const updatedCart = cartItems.filter(
        (_, i) => !selectedItems.includes(i)
      );
      setCartItems(updatedCart);
      setSelectedItems([]);
    } catch (error) {
      console.error("선택한 강의 삭제 중 오류 발생:", error);
    }
  };

  const removeItem = async (lectureId, index) => {
    try {
      // LectureID 속성이 정의되어 있는지 확인
      if (lectureId) {
        // 삭제 요청을 서버에 보냄
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            LectureID: lectureId,
          },
          {
            withCredentials: true,
          }
        );

        // 강의가 성공적으로 삭제된 경우에만 클라이언트 상태 업데이트
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
      } else {
        console.error("선택한 아이템에 유효한 LectureID가 없습니다.");
      }
    } catch (error) {
      console.error("장바구니 아이템 삭제 중 오류 발생:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cartItems.map((_, index) => index));
  };

  const handleCheckboxChange = (index) => {
    const isSelected = selectedItems.includes(index);

    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  

  return (
    <div className="wrap cf">
      <div className="heading cf">
        <div className="cart-title">장바구니</div>
      </div>
      <div className="cartTop">
        <div className="select">
          <input
            className="selectAll"
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span className="selected">
            전체선택 {selectedItems.length}/{cartItems.length}
          </span>
          <button onClick={selectedRemoveItem}>선택삭제</button>
        </div>
      </div>
      <div className="cart">
        <ul className="cartWrap">
          {cartItems.map((item, index) => (
            <li
              key={index}
              className={`items ${index % 2 === 0 ? "even" : "odd"}`}
            >
              <div className="infoWrap">
                <input
                  className="cartChk"
                  type="checkbox"
                  checked={selectedItems.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
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
                  <h3>{item.LectureTitle}</h3>
                  <p className="cart-instructor">{item.InstructorName}</p>
                </div>
                <div className="prodTotal cartSection">
                  <p>{item.LecturePrice.toLocaleString()}원</p>
                </div>
                <div className="cartSection removeWrap">
                  <a
                    href="#"
                    className="remove"
                    onClick={() => removeItem(item.LectureID, index)}
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
            <span className="value">{formattedTotalAmount}원</span>
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
