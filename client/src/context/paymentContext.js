// Context 생성 (예: PaymentContext.js)
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../config/baseUrl';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const toggleEnrollment = async () => {
    try {
      // API 호출
      const response = await axios.get('/api/modify/payment', { /* 필요한 데이터 전달 */ });

      // API 호출 결과에 따라 state 업데이트
      setIsEnrolled(response.data.success);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
    }
  };

  return (
    <PaymentContext.Provider value={{ isEnrolled, toggleEnrollment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePaymentContext = () => {
  return useContext(PaymentContext);
};
