import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 추가
import './style.scss';

const Profile = ({ profileInfo }) => {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드를 나타내는 state

  const handleEditClick = () => {
    setIsEditing(!isEditing); // 수정 모드 토글
  };

  return (
    <div className='profile-info'>
      <h2 className='profile-title'>프로필</h2>
      <div className='profile-detail'>
        <div className='profile-image-container'>
          <img className='profile-image img-fluid rounded-circle' src={profileInfo.imageSrc} alt="" />
        </div>
        <h3 className='profile-name'>{profileInfo.name}</h3>
        {isEditing ? (
          <div className='profile-info'>
            <input type='text' placeholder='닉네임' value={profileInfo.nickname} />
            <input type='text' placeholder='이메일' value={profileInfo.email} />
            <textarea placeholder='소개' value={profileInfo.introduction}></textarea>
          </div>
        ) : (
          <div className='profile-info'>
            <div className='profile-nickname'>{profileInfo.nickname}</div>
            <div className='profile-email'>{profileInfo.email}</div>
            <p className='profile-introduction'>{profileInfo.introduction}</p>
          </div>
        )}
        <div className='profile-update' onClick={handleEditClick}>
          {isEditing ? '완료' : '수정'}
        </div>
      </div>
    </div>
  );
}

export default Profile;
