import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import jsCookie from "js-cookie";
import { baseUrl } from "../../../../config/baseUrl.js";
import lectureDefaultImage from "../../../../img/lectureDefaultImage.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import { AuthContext } from "../../../../context/authContext.js";

// import { useLocation } from "react-router-dom";

const LectureCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { currentUser } = useContext(AuthContext);

  console.log("cartItems", cartItems)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jsCookie.get("userToken");
        const response = await axios.get(`${baseUrl}/api/cart/cartlist-lecture`, {
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
        const token = jsCookie.get("userToken");
        const deletePromises = lectureIds.map(async (id) => {
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            lectureId: id,
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
      console.error("선택한 강의 삭제 중 오류 발생:", error);
    }
  };

  const removeItem = async (lectureId, index) => {
    try {
      // LectureID 속성이 정의되어 있는지 확인
      if (lectureId) {
        // 삭제 요청을 서버에 보냄
        const token = jsCookie.get("userToken");
        await axios.post(
          `${baseUrl}/api/cart/delete-lecture`,
          {
            lectureId: lectureId,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  // const handleCheckboxChange = (index) => {
  //   const isSelected = selectedItems.includes(index);

  //   if (isSelected) {
  //     setSelectedItems(selectedItems.filter((item) => item !== index));
  //   } else {
  //     setSelectedItems([...selectedItems, index]);
  //   }
  // };

  const handleCheckboxChange = (lectureId) => {
    const isSelected = selectedItems.includes(lectureId);
  
    if (isSelected) {
      setSelectedItems(selectedItems.filter((item) => item !== lectureId));
    } else {
      setSelectedItems([...selectedItems, lectureId]);
    }
  };
  
  const PaymentHandler = async () => {
    try {
      if (selectedItems.length > 0) {
        const lectureIds = selectedItems.map((selectedIndex) => {
          const selectedLecture = cartItems[selectedIndex];
          return selectedLecture.LectureID;
        });
  
        const token = jsCookie.get("userToken");
  
        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
          pg: `${process.env.REACT_APP_PAYMENT_PG}`, // PG사
          pay_method: "card", // 결제수단
          merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
          amount: lectureIds.reduce((total, lectureId) => {
            const selectedLecture = cartItems.find(
              (item) => item.LectureID === lectureId
            );
            return total + (selectedLecture ? selectedLecture.LecturePrice : 0);
          }, 0), // 선택한 강의들의 총 결제금액
          name: "강의 결제", // 주문명
          buyer_name: currentUser.UserName, // 구매자 이름
          buyer_email: currentUser.UserEmail, // 구매자 이메일
        };
  
        console.log("paymentData", paymentData);
  
        // IMP SDK 초기화
        const { IMP } = window;
        IMP.init(`${process.env.REACT_APP_IMP_KG_INICIS}`);
  
        // 결제 요청
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
              // 결제 검증을 위한 서버 요청
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
                // 서버로 수강 등록 요청
                const enrollmentResponse = await Promise.all(
                  lectureIds.map(async (lectureId) => {
                    return axios.post(
                      `${baseUrl}/api/enrollment`,
                      { lectureId: lectureId },
                      {
                        withCredentials: true,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                  })
                );
  
                const paymentResponse = await Promise.all(
                  lectureIds.map(async (lectureId) => {
                    return axios.post(
                      `${baseUrl}/api/modify`,
                      { lectureId: lectureId, cardName: cardName },
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
                  lectureIds.map(async (lectureId) => {
                    return axios.post(
                      `${baseUrl}/api/cart/delete-lecture`,
                      { lectureId: lectureId },
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
                  "enrollmentResponse.data.success?",
                  enrollmentResponse.map((res) => res.data)
                );
                console.log(
                  "paymentResponse.data.success?",
                  paymentResponse.map((res) => res.data)
                );
                console.log(
                  "cartResponse.data",
                  cartResponse.map((res) => res.data)
                );
  
                // 모든 수강 등록이 성공한 경우
                if (
                  enrollmentResponse.every(
                    (res) => res.data === "강의 수강 신청이 완료되었습니다."
                  ) &&
                  paymentResponse.every((res) => res.data.success) &&
                  cartResponse.every((res) => res.data === "삭제 성공")
                ) {
                  alert("수강 등록 및 결제가 성공했습니다.");
  
                  window.location.reload();
                } else {
                  // 수강 등록이 실패한 경우에 대한 처리
                  alert("수강 등록에 실패했습니다.");
                  return;
                }
              } else {
                // 결제 검증 실패
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
        console.error("하나 이상의 강의를 선택해야 합니다.");
        alert("하나 이상의 강의를 선택해야 합니다.");
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
                  <p className="cart-instructor" style={{ paddingLeft: "0px" }}>{item.InstructorName}</p>
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