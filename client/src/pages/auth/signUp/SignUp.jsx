import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Kakao from "../../../img/kakaologo.png";
import Google from "../../../img/googlelogo.png";
import "./style.scss";
import { AuthContext } from "../../../context/authContext.js";
import axios from "axios";
import { baseUrl } from "../../../config/baseUrl";
import KakaoLogin from "react-kakao-login";
import SignIn from "../signIn/SignIn";

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
  const [emailCertification, setEmailCertification] = useState(false);
  const [showEmailInputBox, setShowEmailInputBox] = useState(false);
  const [emailDBToken, setEmailDBToken] = useState("");
  const [emailInputToken, setEmailInputToken] = useState("");
  const messages = [
    "나의 성장을 돕는 IT 실무 지식 플랫폼",
    "성장에 목마를 때, You Got IT",
    "나의 온라인 사수, You Got IT",
    "You Got IT에서 가치를 높이세요",
    "You Got IT에서 다양한 성장의 기회를 얻으세요",
  ];
  const kakaoClientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const { signIn } = useContext(AuthContext);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const kakaoOnSuccess = async (data) => {
    console.log("data", data);
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
        navigate("/");
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  const kakaoOnFailure = (error) => {
    window.location.href = "http://localhost:3000";
  };

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
      isCellPhoneValid &&
      emailCertification
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
        setEmail("");
        setName("");
        setPassword("");
        setPasswordCheck("");
        setCellPhone("");
        setNickName("");

        openModal();
      } catch (error) {
        console.error("회원가입 중 오류 발생:", error);
      }
    }
  };

  // const onKakaoLoginButtonClick = async () => {
  //   try {
  //     window.location.href = `${baseUrl}/api/auth/kakao`;
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };

  // const onKakaoLoginButtonClick = async () => {
  //   try {
  //     await axios.post(`${baseUrl}/api/auth/kakao`)
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // }

  const sendEmailButtonClick = async (e) => {
    e.preventDefault();
    setShowEmailInputBox(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/mail/email_certification`,
        {
          UserEmail: email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setEmailDBToken(response.data.token);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const emailCertificationButtonClick = async (e) => {
    e.preventDefault();
    if (emailDBToken === emailInputToken) {
      try {
        const response = await axios.post(
          `${baseUrl}/api/mail/verify-email`,
          {
            email: email,
            token: emailDBToken,
          },
          {
            withCredentials: true,
          }
        );
        console.log("결과", response.data.message);

        // 응답 메시지에 따라 다른 작업을 수행합니다.
        switch (response.data.message) {
          case "토큰이 만료되었습니다. 인증 메일 재전송 하셈":
            alert("토큰이 만료되었습니다.");
            break;
          case "이메일 또는 토큰이 올바르지 않습니다.":
            alert("이메일 또는 토큰이 올바르지 않습니다.");
            break;
          case "이메일 인증이 완료되었습니다.":
            alert("이메일 인증이 완료되었습니다.");
            setEmailCertification(true);
            setShowEmailInputBox(false);
            break;
          default:
            // 다른 경우는 아무 작업도 수행하지 않습니다.
            break;
        }
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      alert("토큰이 올바르지 않습니다.");
      return;
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
        <div className="form-input-block-container">
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
            <button
              onClick={(e) => sendEmailButtonClick(e)}
              disabled={!email || !!emailError} // 이메일이 비어 있거나 에러가 있는 경우 비활성화
            >
              인증메일 전송
            </button>
          </div>
          <div className="error-message-container">
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          {showEmailInputBox && (
            <div className="form-input-block" style={{ marginTop: "5px" }}>
              <input
                type="text"
                className="signup-form-input"
                placeholder="인증코드를 입력하세요."
                onChange={(e) => setEmailInputToken(e.target.value)}
              />
              <button onClick={(e) => emailCertificationButtonClick(e)}>
                인증코드 확인
              </button>
            </div>
          )}
        </div>
        {/* <button
          onClick={(e) => sendEmailButtonClick(e)}
          disabled={!email || !!emailError} // 이메일이 비어 있거나 에러가 있는 경우 비활성화
        >
          인증메일 전송
        </button> */}

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
            name="cellphone"
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
      </form>

      <br />
      <div>
        <div className="checkbox-container">
          <input
            className="signup-checkbox"
            type="checkbox"
            checked={privacyAgree}
            onChange={() => setPrivacyAgree(!privacyAgree)}
          />
          <p className="signup-checkbox-text">개인정보 수집 및 이용에 동의</p>
        </div>
      </div>

      <button className="signup-button" onClick={onSignUpButtonClick}>
        가입하기
      </button>

      <hr className="hr"/>
      <div className="signup-social">
        
        <span className="social-title">간편 로그인</span>
        <div className="social-signup-button">
          {/* <div className="social-button-wrapper">
            <button className="kakao-login" onClick={onKakaoLoginButtonClick}>
              <img src={Kakao} alt="" />
            </button>
          </div> */}
          {/* <div className="social-button-wrapper">
            <button className="google-login">
              <img className="google-logo" src={Google} alt="" />
            </button>
          </div> */}
          <KakaoLogin
            token={kakaoClientId}
            onSuccess={kakaoOnSuccess}
            onFail={kakaoOnFailure}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#fae100",
              color: "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      {isModalOpen && <div className="modal-overlay" onClick={closeModal} />}
      {isModalOpen && <SignIn closeModal={closeModal} />}
    </div>
    
  );
};

export default SignUp;
