import React from "react";
import { Link } from "react-router-dom";
import "./style.scss"; // Import the custom style file

const SignIn = ({ closeModal }) => {
  const handleSignIn = () => {
    // 로그인 로직 처리

    // 로그인 성공 시 모달 닫기
    closeModal();
  };

  return (
    <div className="auth-signin">
      <div className="signin-title">
        <span>Sign In</span>
        
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

      <span>
        <Link className="signup-link" to="/SignUp"> Don't have an account? Click here! </Link>
      </span>
    </div>
  );
};

export default SignIn;
