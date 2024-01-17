// Mypage.jsx

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 추가
import './style.scss';
import Profile from './profile/profile';
import MyCourse from './mycourse/MyCourse';
import Cart from './cart/Cart';
import Payment from './payment/Payment';

const Mypage = () => {
  const [selectedItem, setSelectedItem] = useState('프로필');

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const profileInfo = {
    name: '전윤수',
    nickname: 'Tar9et',
    email: 'tpporg@naver.com',
    introduction: '안녕하세요 ㅇㅅㅇ',
    imageSrc: 'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
  };

  const mycourses = {
    title: "처음 만난 리덕스(Redux)",
    imageSrc: 'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
    progress: 30,
  };

  const cart = {

  }

  const payment = {
    no: 1,
    name: "전윤수",
    email: "tpporg@naver.com",
    imageSrc: 'https://cdn.inflearn.com/public/courses/329963/cover/26550c58-624a-41c8-86dc-fea75b6c3b22/thumbnail-frontnew.png',
    title: "기가 맥히는 Node Js 강의",
    price: "12,300",
    paymentDate : "2024.01.02",
    progress : 30,
  }


  return (
    <div className='profile container'>
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
        {selectedItem === '프로필' && <Profile profileInfo={profileInfo} />}
        {selectedItem === '수강중인 강의' && <MyCourse mycourses={mycourses} />}
        {selectedItem === '장바구니' && <Cart  cart={cart}/>}
        {selectedItem === '결제내역' && <Payment  payment={payment}/>}
      </div>
    </div>
  );
}

export default Mypage;
