import React from "react";
import { Link } from "react-router-dom";
import "./style.scss"; // Import the custom style file
import Logo from '../../../img/YouGotITLogo2.png';

const SignIn = ({ closeModal }) => {
  const handleSignIn = () => {
    // 로그인 로직 처리

    // 로그인 성공 시 모달 닫기
    closeModal();
  };

  return (
    <div className="auth-signin">
      <button className="exit" onClick={closeModal}>X</button>
      <div className="signin-logo">
        <img src={Logo} alt="" />
      </div>
      <form onSubmit={handleSignIn}>
        <div className="signin-input-container">
          <input type="text" placeholder="아이디" />
          <input type="password" placeholder="비밀번호" />
        </div>
        <div className="signin-button-container">
          <button className="signin-button" type="submit">로그인</button>
          <button className="social-login" type="submit">카카오톡 로그인</button>
        </div>
      </form>

    </div>
  );
};

export default SignIn;
