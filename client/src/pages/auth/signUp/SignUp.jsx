import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Kakao from "../../../img/kakaologo.png"
import Google from "../../../img/googlelogo.png"
import "./style.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const messages = [
    "나의 성장을 돕는 IT 실무 지식 플랫폼",
    "성장에 목마를 때, You Got IT",
    "나의 온라인 사수, You Got IT",
    "You Got IT에서 가치를 높이세요",
    "You Got IT에서 다양한 성장의 기회를 얻으세요",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="auth-signup">
        <div className="title">회원가입</div>

        <aside className="signup-message">
          <div className="signup-message-slider">
            <p>{messages[currentMessageIndex]}</p>
          </div>
        </aside>

        <form className="form-group">
          <div className="form-input-block">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <input className="signup-form-input" type="text" name="email" placeholder="example@google.com" />
          </div>

          <div className="form-input-block">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <input className="signup-form-input" type="text" name="name" placeholder="홍길동" />
          </div>

          <div className="form-input-block">
            <label htmlFor="password" className="form-label">
              비밀번호
            </label>
            <input className="signup-form-input" type="password" name="password" placeholder="******" />
          </div>

          <div className="form-input-block">
            <label htmlFor="passwordcheck" className="form-label">
              비밀번호 확인
            </label>
            <input className="signup-form-input" type="password" name="passwordcheck" placeholder="******" />
          </div>

          <div className="form-input-block">
            <label htmlFor="cellphone" className="form-label">
              전화번호
            </label>
            <input className="signup-form-input" type="text" name="email" placeholder="010-0000-0000" />
          </div>

          <div className="form-input-block">
            <label htmlFor="nickname" className="form-label">
              닉네임
            </label>
            <input className="signup-form-input" type="text" name="email" placeholder="Tar9et" />
          </div>
        </form>

        <button className="signup-button">가입하기</button>
        <div>
          <div className="checkbox-container">
            <input className="signup-checkbox" type="checkbox" />
            <p className="signup-checkbox-text">개인 정보 수집 및 이용</p>
          </div>
        </div>
        <div
          className="link"
          onClick={() => {
            navigate("/");
          }}
        >
        </div>
        <div className="signup-social">
          <span className="social-title">간편 회원가입</span>
          <div className="social-signup-button">
            <div className="social-button-wrapper">
              <button className="kakao-login">
                <img src={Kakao} alt="" />
              </button>
            </div>
            <div className="social-button-wrapper">
              <button className="google-login">
                <img className="google-logo" src={Google} alt="" />
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default SignUp;
