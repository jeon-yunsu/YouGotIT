import React, { useEffect, useState, useContext } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import { AuthContext } from "../../../context/authContext";
import jsCookie from "js-cookie";

const ProductDetail = () => {
  const nav = useNavigate();
  const [productData, setProductData] = useState([]);
  const { productID } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1); // 수량 상태 추가 및 초기값 설정

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/store/products/${productID}`,
          {
            withCredentials: true,
          }
        );
        console.log("response.data?", response.data);

        setProductData(response.data.data);
      } catch (error) {
        console.error("검색 중 오류:", error);
      }
    };

    fetchData();
  }, []);

  const addToCartHandler = async () => {
    if (!currentUser) {
      alert("로그인 후 이용해 주세요.");
      return;
    } else {
      try {
        const token = jsCookie.get("userToken");
        // 장바구니에 담기
        await axios.post(
          `${baseUrl}/api/cart/add-product`,
          {
            ProductID : productID,
            Quantity : quantity
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setIsInCart(true);
        alert("장바구니에 강의를 추가했습니다.");
      } catch (error) {
        console.error("API 호출 중 오류:", error);
      }
    }
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("URL이 성공적으로 복사되었습니다:", url);
        setShowToast(true); // 토스트 메시지 보이기
        setTimeout(() => {
          setShowToast(false); // 토스트 메시지 감추기
        }, 2000); // 2초 후에 자동으로 감추기
      })
      .catch((error) => {
        console.error("URL 복사 중 오류 발생:", error);
      });
  };

  const buyProduct = async () => {
    if (!currentUser) {
        alert("로그인 후 이용해 주세요.");
        return;
    }

    try {
        const token = jsCookie.get("userToken");

        // 서버로 결제 요청 데이터 만들기
        const paymentData = {
            pg: `${process.env.REACT_APP_PAYMENT_PG}`, // PG사
            pay_method: "card", // 결제수단
            merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
            amount: productData[0].ProductPrice * quantity, // 결제금액
            name: productData[0].ProductName, // 주문명
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
            // console.log("imp_uid1", response.imp_uid);
            // console.log("merchant_uid1", response.merchant_uid);
            // console.log("payment_amount1", response.paid_amount);
            const imp_uid = response.imp_uid;
            const merchant_uid = response.merchant_uid;
            const payment_amount = response.paid_amount;
            console.log("imp_uid", imp_uid)
            console.log("merchant_uid", merchant_uid)
            console.log("payment_amount", payment_amount)

            if (success) {
                // 성공 처리
                console.log("결제 성공");
                // 성공한 경우 추가 작업 수행
            } else {
                // 실패 처리
                console.log("결제 실패:", error_msg);
                // 실패한 경우 추가 작업 수행
            }
        });
    } catch (error) {
        console.error("API 호출 중 오류:", error);
        alert("결제 요청 중 오류가 발생했습니다.");
    }
};


  return (
    <div className="product">
      <div className="product-container">
        <div className="pd-info">
          {productData && productData.length > 0 && (
            <img
              src={productData[0].ProductImage}
              alt=""
              className="card-image"
            />
          )}
          <div className="pd-form">
            <div className="pd-first-line">
              <div className="pd-name">
                {productData &&
                  productData.length > 0 &&
                  productData[0].ProductName}
              </div>
              <div className="pd__action">
                <button
                  type="button"
                  className="pd__action-btn share"
                  onClick={copyUrlToClipboard}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 10h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1.997"
                      stroke="#828282"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                    ></path>
                    <path
                      d="M11 16V3M7 6l4-4 4 4"
                      stroke="#828282"
                      strokeWidth="1.6"
                    ></path>
                  </svg>
                </button>
                {showToast && (
                  <div className="toast show">
                    URL이 클립보드에 복사되었습니다.
                  </div>
                )}
              </div>
            </div>
            <div className="pd-price">
              {productData &&
                productData.length > 0 &&
                productData[0].ProductPrice.toLocaleString()}
              <span className="pd-currency">원</span>
            </div>

            <div className="pd-count-container">
              <div className="pd-count-title">수량</div>
              <div className="pd-counter">
                <button onClick={decreaseQuantity}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                  >
                    <g fill="none" fillRule="evenodd">
                      <g fill="#4E4E4E">
                        <g>
                          <g>
                            <g transform="translate(-932 -523) translate(932 88) translate(0 405) translate(0 30)">
                              <rect
                                width="12"
                                height="1"
                                x="7"
                                y="12"
                                rx=".5"
                              ></rect>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </button>
                <input
                  type="text"
                  name="quantity"
                  readOnly
                  className="pd-counter__current" 
                  value={quantity}
                ></input>
                <button onClick={increaseQuantity}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                  >
                    <g fill="none" fillRule="evenodd">
                      <g fill="#4E4E4E">
                        <g>
                          <g>
                            <g>
                              <g transform="translate(-1012 -523) translate(932 88) translate(0 405) translate(80 30) translate(7 6)">
                                <rect
                                  width="12"
                                  height="1"
                                  y="6"
                                  rx=".5"
                                ></rect>
                                <path
                                  d="M.5 6h11c.276 0 .5.224.5.5s-.224.5-.5.5H.5C.224 7 0 6.776 0 6.5S.224 6 .5 6z"
                                  transform="rotate(-90 6 6.5)"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            <hr className="divider" />
            <div className="pd-total">
              <div className="pd-total-title">{quantity}개 상품 금액</div>
              <div className="pd-total-price">
                {productData &&
                  productData.length > 0 &&
                  (
                    productData[0].ProductPrice * quantity
                  ).toLocaleString()}{" "}
                {/* 가격 * 수량 계산 후 쉼표로 구분하여 출력 */}
                <span className="pd-currency">원</span>
              </div>
            </div>
            <div className="pd-button">
              <button className="pd-cart" onClick={addToCartHandler}>
                장바구니 담기
              </button>
              <button className="pd-buy" onClick={buyProduct}>
                바로 구매하기
              </button>
            </div>
            <div className="pd-guide">
              <div className="pd-guide-title">배송기간</div>
              <div>
                <div className="pd-guide-desc">
                  지금 주문하면 &nbsp;
                  <span className="pd-guide-start-end-strong">
                    2/21 ~ 2/28 &nbsp;
                  </span>
                  사이에 출발해요!
                </div>
                <div className="pd-guide-please">
                  특별함을 담아 제작해서 배송해드려요.
                  <br />
                  설레는 마음으로 기다려주세요!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pd-description-container">
        <div className="pd-description">상품 정보</div>
        <ul className="pd-description-detail">
          {productData &&
            productData.length > 0 &&
            productData[0].ProductDescription.split(".")
              .filter((line) => line.trim() !== "")
              .map((line, index) => <li key={index}>{line.trim()}</li>)}
        </ul>

        <div className="pd-caution">주의사항</div>
        <ul className="pd-caution-detail">
          {productData &&
            productData.length > 0 &&
            productData[0].ProductCaution.split(".")
              .filter((line) => line.trim() !== "")
              .map((line, index) => <li key={index}>{line.trim()}</li>)}
        </ul>
        {showToast && (
          <div className="toast">URL이 클립보드에 복사되었습니다.</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
