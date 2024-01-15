import React from "react";
import { Link } from "react-router-dom";
import KakaoLogin from "../../../img/kakaologin.png";
import YouGotITLogo from "../../../img/YouGotITLogo.png"
import './style.scss'

const SignUp = () => {
  return (
    <div className="auth">
      <form>
        <div className="logo">
          <Link to="/">
            <div className="logo">
              <img src={YouGotITLogo} alt="YouGotIT 로고" />
            </div>
          </Link>
        </div>
        <div className="form-group">
          <input required type="email" name="email" placeholder="이메일" />
          <input required type="text" name="name" placeholder="이름" />
          <input required type="password" name="password" placeholder="비밀번호" />
          <input required type="password" name="passwordCheck" placeholder="비밀번호 확인" />
          <input required type="text" name="cellPhone" placeholder="전화번호" />
          <input required type="text" name="nickname" placeholder="닉네임" />
        </div>
        <button>회원가입</button>
        <div>
            <h4>개인정보동의</h4>
            <div className="join-form">
                <div>
                    개인정보보호법에 따라 You Got IT에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.
                </div>
                <div>
                    <h3>
                        1. 수집하는 개인정보
                    </h3>
                    <div>
                        이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 You Got IT서비스를 회원과 동일하게 이용할 수 있습니다. <br />
                        이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은 회원제 서비스를 이용하기 위해 회원가입을 할 경우, You Got IT 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.<br />
                        회원가입 시점에 You Got IT 이용자로부터 수집하는 개인정보는 아래와 같습니다.<br />
                        - 회원 가입 시 필수항목으로 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호를, 선택항목으로 이메일주소를 수집합니다.<br />
                         실명 인증된 아이디로 가입 시, 암호화된 동일인 식별정보(CI), 중복가입 확인정보(DI), 내외국인 정보를 함께 수집합니다. 만 14세 미만 아동의 경우, 법정대리인 정보(법정대리인의 이름, 생년월일, 성별, 중복가입확인정보(DI), 휴대전화번호)를 추가로 수집합니다.<br />
                        - 비밀번호 없이 회원 가입 시에는 필수항목으로 아이디, 이름, 생년월일, 휴대전화번호를, 선택항목으로 비밀번호를 수집합니다.<br />
                        - 단체 회원가입 시 필수 항목으로 단체아이디, 비밀번호, 단체이름, 이메일주소, 휴대전화번호를, 선택항목으로 단체 대표자명을 수집합니다.<br />
                        서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와 같습니다.<br />
                        - 회원정보 또는 개별 서비스에서 프로필 정보(별명, 프로필 사진)를 설정할 수 있습니다. 회원정보에 별명을 입력하지 않은 경우에는 마스킹 처리된 아이디가 별명으로 자동 입력됩니다.<br />
                        - You Got IT내의 개별 서비스 이용, 이벤트 응모 및 경품 신청 과정에서 해당 서비스의 이용자에 한해 추가 개인정보 수집이 발생할 수 있습니다. 추가로 개인정보를 수집할 경우에는 해당 개인정보 수집 시점에서 이용자에게 ‘수집하는 개인정보 항목, 개인정보의 수집 및 이용목적, 개인정보의 보관기간’에 대해 안내 드리고 동의를 받습니다.<br />
                        서비스 이용 과정에서 IP 주소, 쿠키, 서비스 이용 기록, 기기정보, 위치정보가 생성되어 수집될 수 있습니다. 또한 이미지 및 음성을 이용한 검색 서비스 등에서 이미지나 음성이 수집될 수 있습니다.<br />
                        구체적으로 1) 서비스 이용 과정에서 이용자에 관한 정보를 자동화된 방법으로 생성하여 이를 저장(수집)하거나, 2) 이용자 기기의 고유한 정보를 원래의 값을 확인하지 못 하도록 안전하게 변환하여 수집합니다.<br />
                        서비스 이용 과정에서 위치정보가 수집될 수 있으며,
                        You Got IT서 제공하는 위치기반 서비스에 대해서는 'You Got IT위치기반서비스 이용약관'에서 자세하게 규정하고 있습니다.<br />
                        이와 같이 수집된 정보는 개인정보와의 연계 여부 등에 따라 개인정보에 해당할 수 있고, 개인정보에 해당하지 않을 수도 있습니다.<br />
                        생성정보 수집에 대한 추가 설명<br />
                        - IP(Internet Protocol) 주소란?<br />
                        IP 주소는 인터넷 망 사업자가 인터넷에 접속하는 이용자의 PC 등 기기에 부여하는 온라인 주소정보 입니다. IP 주소가 개인정보에 해당하는지 여부에 대해서는 각국마다 매우 다양한 견해가 있습니다.<br />
                        - 서비스 이용기록이란?<br />
                        You Got IT접속 일시, 이용한 서비스 목록 및 서비스 이용 과정에서 발생하는 정상 또는 비정상 로그 일체,메일 수발신 과정에서 기록되는 이메일주소, 친구 초대하기 또는 선물하기 등에서 입력하는 휴대전화번호, 스마트스토어 판매자와 구매자간 상담내역(You Got IT톡 및 상품 Q&A 게시글) 등을 의미합니다.<br />
                        - 기기정보란?<br />
                        본 개인정보처리방침에 기재된 기기정보는 생산 및 판매 과정에서 기기에 부여된 정보뿐 아니라, 기기의 구동을 위해 사용되는 S/W를 통해 확인 가능한 정보를 모두 일컫습니다. OS(Windows, MAC OS 등) 설치 과정에서 이용자가 PC에 부여하는 컴퓨터의 이름, PC에 장착된 주변기기의 일련번호, 스마트폰의 통신에 필요한 고유한 식별값(IMEI, IMSI), AAID 혹은 IDFA, 설정언어 및 설정 표준시, USIM의 통신사 코드 등을 의미합니다. 단, You Got IT IMEI와 같은 기기의 고유한 식별값을 수집할 필요가 있는 경우, 이를 수집하기 전에 You Got IT 원래의 값을 알아볼 수 없는 방식으로 암호화 하여 식별성(Identifiability)을 제거한 후에 수집합니다.<br />
                        - 쿠키(cookie)란?<br />
                        쿠키는 이용자가 웹사이트를 접속할 때에 해당 웹사이트에서 이용자의 웹브라우저를 통해 이용자의 PC에 저장하는 매우 작은 크기의 텍스트 파일입니다. 이후 이용자가 다시 웹사이트를 방문할 경우 웹사이트 서버는 이용자 PC에 저장된 쿠키의 내용을 읽어 이용자가 설정한 서비스 이용 환경을 유지하여 편리한 인터넷 서비스 이용을 가능케 합니다. 또한 방문한 서비스 정보, 서비스 접속 시간 및 빈도, 서비스 이용 과정에서 생성된 또는 제공(입력)한 정보 등을 분석하여 이용자의 취향과 관심에 특화된 서비스(광고 포함)를 제공할 수 있습니다. 이용자는 쿠키에 대한 선택권을 가지고 있으며, 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다. 다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 You Got IT일부 서비스의 이용에 불편이 있을 수 있습니다.<br />
                    </div>
                    <br />
                    <div>

                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <input type="checkbox" />
                <p>개인 정보 수집 및 이용</p>
            </div>
        </div>
        <span>
          Don't you have an account? <Link to="/SignIn">로그인</Link>
        </span>
        <div className="simple-signUp">
          <h3>소셜 회원가입</h3>
          <img src={KakaoLogin} alt="카카오 로그인" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
