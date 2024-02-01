import React, { useState, useContext } from "react";
import { signIn } from "../../../apis/authApi.tsx";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../../img/YouGotITLogo2.png";
import { AuthContext } from "../../../context/authContext.js";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl.js";

const SignIn = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resistrationType, setRegistrationType] = useState(0);

  const { signIn } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      await signIn(username, password);
  
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('인증 중 오류:', error);
  
      // 에러 메시지에 따라 다른 알림을 사용자에게 보여줄 수 있습니다.
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || '로그인 중 오류가 발생했습니다.';
        alert(errorMessage);
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
};

  const onKakaoLoginButtonClick = async () => {
    try {
      window.location.href = `${baseUrl}/api/auth/kakao`;
    } catch (error) {
      console.log("error: ", error);
    }
  }  

  return (
    <div className="auth-signin">
      <button className="exit" onClick={closeModal}>
        X
      </button>
      <div className="signin-logo">
        <img src={Logo} alt="" />
      </div>
      <form onSubmit={handleSignIn}>
        <div className="signin-input-container">
          <input
            type="text"
            placeholder="아이디"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="signin-button-container">
          <button className="signin-button" type="submit">
            로그인
          </button>
          <button className="social-login" type="button" onClick={onKakaoLoginButtonClick}>
            카카오톡 로그인
          </button>
          {/* <a href="https://kauth.kakao.com/oauth/authorize?client_id=ef6faaebf1f7bc18e09f76bde177053d&redirect_uri=http://localhost:4000/api/auth/kakao/callback&response_type=code">카카오 로그인</a> */}
        </div>
      </form>
    </div>
  );
};

export default SignIn;
