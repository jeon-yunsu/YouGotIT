import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
const Payment = ({payment}) => {
    return (
        <div className='payment'>
            <h3 className='list-title'>결제내역</h3>
            <div className='payment-card'>
                <table className='payment-table'>
                    <tr>
                        <td className='payment-container-no'>번호</td>
                        <td className='payment-container-name'>이름</td>
                        <td className='payment-container-email'>이메일</td>
                        <td className='payment-container-title'>강의명</td>
                        <td className='payment-container-price'>구매금액</td>
                        <td className='payment-container-date'>구매일</td>
                        <td className='payment-container-progress'>진도율</td>
                        <td className='payment-container-cancel'>취소</td>
                    </tr>
                    <tr>
                        <td className='payment-no'>{payment.no}</td>
                        <td className='payment-name'>{payment.name}</td>
                        <td className='payment-email'>{payment.email}</td>
                        <td className='payment-title'>{payment.title}</td>
                        <td className='payment-price'>{payment.price}</td>
                        <td className='payment-date'>{payment.paymentDate}</td>
                        <td className='payment-progress'>{payment.progress}%</td>
                        <td><button className='btn btn-primary'>취소</button></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Payment
