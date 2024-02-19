import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import jsCookie from "js-cookie";
import { baseUrl } from "../../../../config/baseUrl.js";
import lectureDefaultImage from "../../../../img/lectureDefaultImage.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import { AuthContext } from "../../../../context/authContext.js";

const LectureCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");
        const response = await axios.get(
          `${baseUrl}/api/cart/cartlist-product`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("장바구니 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  console.log("cartItems", cartItems);

  const totalAmount = selectedItems.reduce((total, selectedIndex) => {
    const selectedItem = cartItems[selectedIndex];

    if (selectedItem && selectedItem.ProductPrice) {
      return total + selectedItem.ProductPrice * selectedItem.Quantity;
    }

    return total;
  }, 0);

  const formattedTotalAmount = totalAmount;

  const selectedRemoveItem = async (index) => {
    try {
      const productIds = selectedItems
        .map((selectedIndex) => cartItems[selectedIndex]?.ProductID)
        .filter(Boolean);
      const token = jsCookie.get("userToken");
      const deletePromises = productIds.map(async (id) => {
        await axios.post(
          `${baseUrl}/api/cart/delete-product`,
          {
            productId: id,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
      console.error("선택한 상품 삭제 중 오류 발생:", error);
    }
  };

  console.log("selectedItems", selectedItems);

  const removeItem = async (productId, index) => {
    try {
      if (productId) {
        const token = jsCookie.get("userToken");
        await axios.post(
          `${baseUrl}/api/cart/delete-product`,
          {
            productId: productId,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
      } else {
        console.error("선택한 아이템에 유효한 ProductID가 없습니다.");
      }
    } catch (error) {
      console.error("장바구니 아이템 삭제 중 오류 발생:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cartItems.map((_, index) => index));
  };

  const handleCheckboxChange = (productId) => {
    const isSelected = selectedItems.includes(productId);

    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const PaymentHandler = async () => {
    try {
      if (selectedItems.length > 0) {
        const productIds = selectedItems.map((selectedIndex) => {
          const selectedProduct = cartItems[selectedIndex];
          return selectedProduct.ProductID;
        });

        const token = jsCookie.get("userToken");

        const paymentData = {
          pg: `${process.env.REACT_APP_PAYMENT_PG}`,
          pay_method: "card",
          merchant_uid: `mid_${new Date().getTime()}`,
          amount: productIds.reduce((total, productId) => {
            const selectedProduct = cartItems.find(
              (item) => item.ProductID === productId
            );
            return total + (selectedProduct ? selectedProduct.ProductPrice : 0);
          }, 0),
          name: "상품 결제",
          buyer_name: currentUser.UserName,
          buyer_email: currentUser.UserEmail,
        };

        console.log("paymentData", paymentData);

        const { IMP } = window;
        IMP.init(`${process.env.REACT_APP_IMP_KG_INICIS}`);

        IMP.request_pay(paymentData, async (response) => {
          const { success, error_msg } = response;
          console.log("imp_uid1", response.imp_uid);
          console.log("merchant_uid1", response.merchant_uid);
          console.log("payment_amount1", response.paid_amount);
          const imp_uid = response.imp_uid;
          const merchant_uid = response.merchant_uid;
          const payment_amount = response.paid_amount;
          if (success) {
            try {
              const verificationResponse = await axios.post(
                `${baseUrl}/api/modify/payment-verify`,
                {
                  imp_uid: imp_uid,
                  merchant_uid: merchant_uid,
                  payment_amount: payment_amount,
                },
                {
                  withCredentials: true,
                }
              );

              console.log(
                "verificationResponse.data",
                verificationResponse.data
              );
              const cardName = verificationResponse.data.cardName;
              console.log("cardName", cardName);
              if (verificationResponse.data.success) {
               
                const paymentResponse = await Promise.all(
                  productIds.map(async (productId) => {
                    return axios.post(
                      `${baseUrl}/api/modify/payment-product`,
                      { productId: productId, cardName: cardName },
                      {
                        withCredentials: true,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  })
                );

                const cartResponse = await Promise.all(
                  productIds.map(async (productId) => {
                    return axios.post(
                      `${baseUrl}/api/cart/delete-product`,
                      { productId: productId },
                      {
                        withCredentials: true,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  })
                );

                console.log(
                  "paymentResponse.data.success?",
                  paymentResponse.map((res) => res.data)
                );
                console.log(
                  "cartResponse.data",
                  cartResponse.map((res) => res.data)
                );

                if (
                  paymentResponse.every((res) => res.data.success) &&
                  cartResponse.every((res) => res.data === "삭제 성공")
                ) {
                  alert("상품 결제가 성공했습니다.");

                  window.location.reload();
                } else {
                  alert("상품 결제에 실패했습니다.");
                  return;
                }
              } else {
                alert("결제 검증에 실패했습니다.");
                return;
              }
            } catch (error) {
              console.error("API 호출 중 오류:", error);
              alert("결제 요청 중 오류가 발생했습니다.");
              return;
            }
          } else {
            alert(`결제 실패: ${error_msg}`);
            return;
          }
        });
      } else {
        console.error("하나 이상의 상품을 선택해야 합니다.");
        alert("하나 이상의 상품을 선택해야 합니다.");
        return;
      }
    } catch (error) {
      console.error("결제 처리 중 오류 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
      return;
    }
  };

  return (
    <div className="wrap cf">
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
                  {item.ProductImage ? (
                    <img src={item.ProductImage} alt="" className="itemImg" />
                  ) : (
                    <img
                      src={lectureDefaultImage}
                      alt="Default Lecture Image"
                      className="itemImg"
                    />
                  )}
                  <h3>{item.ProductName}</h3>
                  <p className="cart-instructor" style={{ paddingLeft: "0px" }}>
                    {item.Quantity}개
                  </p>
                </div>
                <div className="prodTotal cartSection">
                  <p>{item.ProductPrice * item.Quantity}원</p>
                </div>
                <div className="cartSection removeWrap">
                  <a
                    href="#"
                    className="remove"
                    onClick={() => removeItem(item.ProductID, index)}
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
            <a href="#" className="btn continue" onClick={PaymentHandler}>
              결제하기
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LectureCart;
