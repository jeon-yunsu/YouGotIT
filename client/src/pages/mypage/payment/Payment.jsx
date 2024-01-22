import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Payment = ({ payments }) => {
  return (
    <div className='payment'>
      <div className='list-title'>결제내역</div>
      <div className='payment-card'>
        <table className='payment-table'>
          <thead>
            <tr>
              <th className='payment-container-no'>번호</th>
              <th className='payment-container-title'>강의명</th>
              <th className='payment-container-price'>구매금액</th>
              <th className='payment-container-date'>구매일</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.no}>
                <td className='payment-no'>{payment.no}</td>
                <td className='payment-title'>{payment.title}</td>
                <td className='payment-price'>{payment.price}</td>
                <td className='payment-date'>{payment.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
