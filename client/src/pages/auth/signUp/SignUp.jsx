import React from "react";
import { Link, useNavigate } from "react-router-dom";
import KakaoLogin from "../../../img/kakaologin.png";
import YouGotITLogo from "../../../img/YouGotITLogo.png"
import './style.scss';

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-signup">
      <form className="auth-form-container">
        <div className="title">Sign Up</div>
        <div className="form-group">
          <input className="first-input"  type="email" name="email" placeholder="이메일" />
          <input  type="text" name="name" placeholder="이름" />
          <input  type="password" name="password" placeholder="비밀번호" />
          <input  type="password" name="passwordCheck" placeholder="비밀번호 확인" />
          <input  type="text" name="cellPhone" placeholder="전화번호" />
          <input  className="last-input"  type="text" name="nickname" placeholder="닉네임" />
        </div>
        <button>회원가입</button>
        <div>
            <div className="checkbox-container">
                <input type="checkbox" />
                <p>개인 정보 수집 및 이용</p>
            </div>
        </div>
        <div className="link" onClick={()=>{navigate("/"); }}>
            <div>Already have an account? Click here!</div>
        </div>
        <div className="simple-signUp">
          <p className="social-signUp">소셜 로그인</p>
          <img src={KakaoLogin} alt="카카오 로그인" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
