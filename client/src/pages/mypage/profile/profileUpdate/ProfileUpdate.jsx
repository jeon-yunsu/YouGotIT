import React, { useState } from 'react';
import './style.scss';
import defaultProfileImage from '../../../../img/banner.png';

const ProfileUpdate = ({ initialName, initialPhoneNumber, initialIntroduction }) => {
  const [name, setName] = useState(initialName);
  const [profileImg, setProfileImg] = useState(defaultProfileImage);
  const [imageChanged, setImageChanged] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [introduction, setIntroduction] = useState(initialIntroduction);
  const [introChanged, setIntroChanged] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const onPictureChange = () => {
    // 이미지 업로드 처리 로직...
    setImageChanged(true); // 이미지 변경을 true로 설정
    // setProfileImg(...) // 실제로 이미지를 업데이트 하는 로직 필요
  };

  const onNameChange = (event) => {
    setName(event.target.value);
    setNameChanged(true);
  };

  const onPhoneChange = (event) => {
    setPhoneNumber(event.target.value);
    setPhoneChanged(true);
  };

  const onIntroChange = (event) => {
    setIntroduction(event.target.value);
    setIntroChanged(true);
  };

  const onSaveChanges = () => {
    if (imageChanged || nameChanged || phoneChanged || introChanged) {
      console.log('변경 사항 저장');
      // 서버로 변경사항 저장을 요청하는 코드 추가
    }
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleAgreementChange = (event) => {
    setAgreed(event.target.checked);
  };

  const handlePasswordUpdate = () => {
    if (currentPassword && newPassword === confirmPassword) {
      console.log('비밀번호 변경 요청');
      // API 호출 등의 로직 구현
    } else if (!currentPassword) {
      console.log('현재 비밀번호를 입력해주세요.');
    } else {
      console.log('새 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleAccountDeletion = () => {
    if (agreed) {
      console.log('회원탈퇴 처리');
      // 여기에 회원탈퇴 처리 로직을 추가
    }
  };

  return (
    <div className='profile-page'>
      <div className='profile-nav'>
        <div className='profile-content'>
          <div className='profile-image-container'>
            <img src={profileImg} alt='Profile' className='profile-image' />
            <p className='upload-instructions'>
              최대 1MB까지 업로드 가능합니다.
              <br />
              현재 이미지는 현재용으로 측정됩니다.
            </p>
            <button onClick={onPictureChange} className='btn-upload'>
              프로필 사진 업로드
            </button>
          </div>
          <div className='profile-info'>
            <label className='input-label'>
              닉네임 변경
              <input
                type='text'
                value={name}
                onChange={onNameChange}
                placeholder='닉네임'
                className='input-field'
              />
            </label>
            <button
              onClick={onSaveChanges}
              className='btn-save'
              disabled={!(imageChanged || nameChanged)}
            >
              변경 사항 저장
            </button>
          </div>
        </div>

        <div className='profile-cellphone-change'>
          <div className='cellphone-input-group'>
            <label htmlFor='cellphone'>전화번호 변경</label>
            <input
              id='cellphone'
              type='text'
              value={phoneNumber}
              onChange={onPhoneChange}
              placeholder='전화번호 입력'
              className='input-field'
            />
          </div>
          <button
            className='cellphone-save'
            onClick={onSaveChanges}
            disabled={!phoneChanged}
          >
            변경사항 저장
          </button>
        </div>

        <div className='profile-intro-change'>
          <div className='introduction-input-group'>
            <label htmlFor='introduction'>자기소개 변경</label>
            <textarea
              id='introduction'
              value={introduction}
              onChange={onIntroChange}
              placeholder='자기소개 입력'
              className='input-field'
            />
          </div>
          <button
            className='introduction-save'
            onClick={onSaveChanges}
            disabled={!introChanged}
          >
            변경사항 저장
          </button>
        </div>

        <div className='profile-password-change'>
          <div className='password-input-group'>
            <label htmlFor='current-password'>현재 비밀번호</label>
            <input
              id='current-password'
              type='password'
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              placeholder='현재 비밀번호 입력'
              className='input-field'
            />
          </div>
          <div className='password-input-group'>
            <label htmlFor='new-password'>새로운 비밀번호</label>
            <input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder='새로운 비밀번호 입력'
              className='input-field'
            />
          </div>
          <div className='password-input-group'>
            <label htmlFor='confirm-password'>새로운 비밀번호 확인</label>
            <input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder='새로운 비밀번호 확인'
              className='input-field'
            />
          </div>
          <button
            onClick={handlePasswordUpdate}
            className='btn-password-change'
            disabled={!currentPassword}
          >
            변경 사항 저장
          </button>
        </div>

        <div className='account-deletion-section'>
          <p>
            <h5>탈퇴</h5>를 원하시나요? 서비스에서 탈퇴하면 모든 정보가 삭제되며
            복구할 수 없습니다.
          </p>
          <div className='deletion-warning'>
            서비스에 만족하지 못하셨나요? 탈퇴하기 전에 먼저 개선요청을 해보시는
            건 어떨까요? <br />
            그래도 탈퇴하시겠다면 탈퇴 전에 아래 유의사항을 꼭 읽어주세요!{' '}
            <br />
            🙇🏻‍♂️ 감사합니다 🙇🏻‍♀️ <br />
            <div className='divider'>유의사항</div>
            <br /> 1.계정 탈퇴 시, You Got IT 서비스에서 모두 탈퇴됩니다.
            <br />
            2.탈퇴 시 계정과 관련된 모든 권한이 사라지며 복구할 수 없습니다.
            <br />
            3.직접 작성한 콘텐츠(동영상, 게시물, 댓글 등)는 자동으로 삭제되지
            않으며, 만일 삭제를 원하시면 탈퇴 이전에 삭제가 필요합니다. <br />
            4.탈퇴 후 동일한 메일로 재가입이 가능하나, 탈퇴한 계정과 연동되지
            않습니다. <br />
            5.탈퇴 후 연동된 소셜 계정 정보도 사라지며 소셜 로그인으로 기존 계정
            이용이 불가능합니다. <br />
            6.현재 비밀번호를 입력하고 탈퇴하기를 누르시면 위 내용에 동의하는
            것으로 간주됩니다.
          </div>
          <div className='checkbox-agreement'>
            <input
              type='checkbox'
              id='agree-checkbox'
              checked={agreed}
              onChange={handleAgreementChange}
            />
            <label htmlFor='agree-checkbox'>위 사항에 동의하시겠습니까?</label>
          </div>
          <button
            onClick={handleAccountDeletion}
            className='btn-delete-account'
            disabled={!agreed}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
