import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import Profile from './profile/profile';
import MyCourse from './mycourse/MyCourse';
import Cart from './cart/Cart';
import PaymentList from './paymentList/PaymentList';

const Mypage = () => {
  const [selectedItem, setSelectedItem] = useState('프로필');
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className='profile'>
      <ul className='profile-list'>
        <li onClick={() => handleItemClick('프로필')} className={`list-group-item ${selectedItem === '프로필' && 'active'}`}>
          프로필
        </li>
        <li onClick={() => handleItemClick('수강중인 강의')} className={`list-group-item ${selectedItem === '수강중인 강의' && 'active'}`}>
          수강중인 강의
        </li>
        <li onClick={() => handleItemClick('장바구니')} className={`list-group-item ${selectedItem === '장바구니' && 'active'}`}>
          장바구니
        </li>
        <li onClick={() => handleItemClick('결제내역')} className={`list-group-item ${selectedItem === '결제내역' && 'active'}`}>
          결제내역
        </li>
      </ul>
      <div className="vl"></div>
      <div className='profile-content-container'>
        {selectedItem === '프로필' && <Profile />}
        {selectedItem === '수강중인 강의' && <MyCourse />}
        {selectedItem === '장바구니' && <Cart />}
        {selectedItem === '결제내역' && <PaymentList />}
      </div>
    </div>
  );
}

export default Mypage;
