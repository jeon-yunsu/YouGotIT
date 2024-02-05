import React, { useState, useContext } from "react";
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

  //JavaScript KEY
  const kakaoClientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
  // console.log("Kakao client", kakaoClientId)

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

        signIn(response.data.UserEmail, response.data.Password);
        closeModal();
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  const kakaoOnFailure = (error) => {
    window.location.href='http://localhost:3000';
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
            style={{
              width: "80%",
              padding: "10px",
              backgroundColor: "#fae100",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
