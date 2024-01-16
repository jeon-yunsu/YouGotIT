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
                        <td></td>
                        <td>이름</td>
                        <td>이메일</td>
                        <td>강의명</td>
                        <td>구매금액</td>
                        <td>구매일</td>
                        <td>진도율</td>
                        <td>취소</td>
                    </tr>
                    <tr>
                        <td className='payment-no'>{payment.no}</td>
                        <td className='payment-name'>{payment.name}</td>
                        <td className='payment-email'>{payment.email}</td>
                        <td className='payment-title'>
                            <img src={payment.imageSrc} alt={payment.title} style={{ width: '200px', height: '100px' }}/>{payment.title}
                        </td>
                        <td className='payment-price'>{payment.price}</td>
                        <td className='payment-date'>{payment.paymentDate}</td>
                        <td className='payment-progress'>{payment.progress}</td>
                        <td><button className='btn btn-primary'>취소</button></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Payment
