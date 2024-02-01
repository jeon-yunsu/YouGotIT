import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../../img/YouGotITLogo2.png";
import { AuthContext } from "../../../context/authContext.js";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl.js";
import KakaoLogin from "react-kakao-login";

const SignIn = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useContext(AuthContext);
  const kakaoClientId = "c2065d78a684dbcfaac5433fba1befe3";

  useEffect(() => {
    if (username && password) {
      signIn(username, password);
      closeModal();
    }
  }, [username, password]);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signIn(username, password);

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("인증 중 오류:", error);

      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "로그인 중 오류가 발생했습니다.";
        alert(errorMessage);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  const onKakaoLoginButtonClick = async () => {
    try {
      window.location.href = `${baseUrl}/api/auth/kakao`;
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const kakaoOnSuccess = async (data) => {
    console.log(data);
    const idToken = data.response.access_token;

    if (idToken) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/auth/kakao/callback`,
          {
            idToken,
          },
          {
            withCredentials: true,
          }
        );

        console.log("response.data12: ", response.data);
        setUsername(response.data.UserEmail);
        setPassword(response.data.Password);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  const kakaoOnFailure = (error) => {
    console.log(error);
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
          <KakaoLogin
            token={kakaoClientId}
            onSuccess={kakaoOnSuccess}
            onFail={kakaoOnFailure}
          />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
