import React, { useState, useContext } from "react";
import { signIn } from "../../../apis/authApi.tsx";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../../img/YouGotITLogo2.png";
import { AuthContext } from "../../../context/authContext.js";

const SignIn = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signIn(username, password);

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('인증 중 오류:', error);
    }
  };

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
          <button className="social-login" type="button">
            카카오톡 로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
