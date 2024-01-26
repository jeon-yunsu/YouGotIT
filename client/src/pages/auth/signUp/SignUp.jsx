import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Kakao from "../../../img/kakaologo.png";
import Google from "../../../img/googlelogo.png";
import "./style.scss";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickName] = useState("");
  const [cellphone, setCellPhone] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNickNameError] = useState("");
  const [nameError, setNameError] = useState("");
  const [cellphoneError, setCellPhoneError] = useState("");
  const [privacyAgree, setPrivacyAgree] = useState("");
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

  const validateEmail = async () => {
    // 이메일 유효성 검사를 수행
    const emailRegex = /^[^\s@]{5,}@[^\s@]+\.(com|net)$/;

    if (!email) {
      setEmailError("이메일 주소를 입력해주세요.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 형식을 입력해주세요.");
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-email`,
          {
            params: {
              email: email,
            },
            withCredentials: true,
          }
        );

        if (response.data.isDuplicate) {
          setEmailError("중복된 이메일 주소입니다.");
          return false;
        } else {
          setEmailError("");
          return true;
        }
      } catch (error) {
        console.error("이메일 중복 검사 중 오류 발생:", error);
        return false;
      }
    }
  };

  const validateName = () => {
    // 이름 유효성 검사를 수행
    const nameRegex = /^[ㄱ-ㅎ|가-힣].{1,4}$/;

    if (!name) {
      setNameError("이름을 입력해주세요.");
      return false;
    } else if (!nameRegex.test(name) || name.length < 1 || name.length >= 5) {
      setNameError("1글자 이상 5글자 미만 한글만 입력 가능합니다.");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validatePassword = () => {
    // 비밀번호 유효성 검사를 수행
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      return false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 최소 8자 이상, 영문자와 숫자, 특수 문자를 포함해야 합니다."
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validatePasswordMatch = () => {
    //비밀번호 확인
    if (!passwordCheck) {
      setPasswordMatchError("비밀번호를 입력해주세요.");
      return false;
    } else if (password !== passwordCheck) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      return false;
    } else {
      setPasswordMatchError("");
      return true;
    }
  };

  const validateCellPhone = async () => {
    // 전화번호 유효성 검사
    const cellPhoneRegex = /^010[0-9]{8}$/;

    if (!cellphone) {
      setCellPhoneError("전화번호를 입력해주세요.");
      return false;
    } else if (cellphone.includes("-")) {
      setCellPhoneError("전화번호에는 하이픈(-)을 포함할 수 없습니다.");
      return false;
    } else if (!cellPhoneRegex.test(cellphone)) {
      setCellPhoneError("유효한 전화번호 형식을 입력해주세요.");
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-cellphone`,
          {
            params: {
              cellphone: cellphone,
            },
            withCredentials: true,
          }
        );

        if (response.data.isDuplicate) {
          setCellPhoneError("중복된 전화번호입니다.");
          return false;
        } else {
          setCellPhoneError("");
          return true;
        }
      } catch (error) {
        console.error("전화번호 중복 검사 중 오류 발생:", error);
        return false;
      }
    }
  };

  const validateNickname = async () => {
    // 클라이언트 사이드에서의 닉네임 형식 검사
    const nicknameRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/;

    if (!nickname) {
      setNickNameError("닉네임을 입력해주세요.");
      return false;
    } else if (!nicknameRegex.test(nickname)) {
      setNickNameError("1글자 이상 9글자 미만으로 입력해주세요.");
      return false;
    } else {
      // 서버 사이드에서의 중복 검사를 위한 API 요청
      try {
        const response = await axios.get(
          `${baseUrl}/api/auth/duplication-nickname`,
          {
            params: {
              nickname: nickname,
            },
            withCredentials: true,
          }
        );
        console.log(response.data.isDuplicate);
        if (response.data.isDuplicate) {
          setNickNameError("중복된 닉네임입니다.");
          return false;
        } else {
          setNickNameError("");
          return true;
        }
      } catch (error) {
        console.error("닉네임 중복 검사 중 오류 발생:", error);
        return false;
      }
    }
  };

  const onSignUpButtonClick = async (e) => {
    e.preventDefault();

    if (!privacyAgree) {
      alert("개인 정보 수집 및 이용에 동의해주세요.");
      return;
    }

    const isEmailValid = validateEmail();
    const isNicknameValid = validateNickname();
    const isCellPhoneValid = validateCellPhone();
    const isNameValid = validateName();
    const isPasswordValid = validatePassword();
    const isPasswordMatchValid = validatePasswordMatch();

    if (
      isEmailValid &&
      isNicknameValid &&
      isNameValid &&
      isPasswordValid &&
      isPasswordMatchValid &&
      isCellPhoneValid
    ) {
      try {
        // 여기에 회원가입을 위한 API 호출 추가
        const response = await axios.post(
          `${baseUrl}/api/auth/signUp`,
          {
            UserEmail: email,
            UserName: name,
            Password: password,
            PasswordCheck: passwordCheck,
            UserCellPhone: cellphone,
            UserNickname: nickname,
          },
          {
            withCredentials: true,
          }
        );

        // API 호출에 대한 후속 처리 추가
        console.log("회원가입 성공:", response);
        alert(`${name}님, 환영합니다!`);
        navigate("/");
      } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
      }
    }
  };

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
          <input
            className="signup-form-input"
            type="text"
            name="email"
            placeholder="example@google.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        <div className="form-input-block">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <input
            className="signup-form-input"
            type="text"
            name="name"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={validateName}
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>

        <div className="form-input-block">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            className="signup-form-input"
            type="password"
            name="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>

        <div className="form-input-block">
          <label htmlFor="passwordcheck" className="form-label">
            비밀번호 확인
          </label>
          <input
            className="signup-form-input"
            type="password"
            name="passwordcheck"
            placeholder="******"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            onBlur={validatePasswordMatch}
          />
          {passwordMatchError && (
            <p className="error-message">{passwordMatchError}</p>
          )}
        </div>

        <div className="form-input-block">
          <label htmlFor="cellphone" className="form-label">
            전화번호
          </label>
          <input
            className="signup-form-input"
            type="text"
            name="email"
            placeholder="01012345678"
            value={cellphone}
            onChange={(e) => setCellPhone(e.target.value)}
            onBlur={validateCellPhone}
          />
          {cellphoneError && <p className="error-message">{cellphoneError}</p>}
        </div>

        <div className="form-input-block">
          <label htmlFor="nickname" className="form-label">
            닉네임
          </label>
          <input
            className="signup-form-input"
            type="text"
            name="nickname"
            placeholder="Tar9et"
            value={nickname}
            onChange={(e) => setNickName(e.target.value)}
            onBlur={validateNickname}
          />
          {nicknameError && <p className="error-message">{nicknameError}</p>}
        </div>

        <button className="signup-button" onClick={onSignUpButtonClick}>
          가입하기
        </button>
      </form>

      <div>
      <div className="checkbox-container">
        <input
          className="signup-checkbox"
          type="checkbox"
          checked={privacyAgree}
          onChange={() => setPrivacyAgree(!privacyAgree)}
        />
        <p className="signup-checkbox-text">개인 정보 수집 및 이용에 동의</p>
      </div>
      </div>
      <div
        className="link"
        onClick={() => {
          navigate("/");
        }}
      ></div>
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
