// export const onClickPayment = (cartItems, totalPrice, user) => {
//     const { IMP } = window;
//     IMP.init(`${process.env.REACT_APP_IMP}`);
  
//     const formatName = (cartItems) => {
//       return cartItems.length > 1
//         ? `${cartItems[0].title} 외 + ${cartItems.length}`
//         : `${cartItems[0].title}`;
//     };
  
//     const data = {
//       pg: `${process.env.REACT_PAYMENT_PG}`, // PG사
//       pay_method: "card", // 결제수단
//       merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
//       amount: totalPrice, // 결제금액
//       name: formatName(cartItems), // 주문명
//       buyer_name: user.name, // 구매자 이름
//     //   buyer_tel: user.phone, // 구매자 전화번호
//       buyer_email: user.email, // 구매자 이메일
//     };
//     IMP.request_pay(data, callback);
//   };
//   const callback = (response) => {
//     const { success, error_msg } = response;
//     if (success) {
//       alert("결제 성공");
//     } else {
//       alert(`결제 실패: ${error_msg}`);
//     }
//   };