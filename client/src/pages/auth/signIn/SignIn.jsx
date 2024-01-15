import React, { useState } from "react";
import { Link } from "react-router-dom";
import KakaoLogin from "../../../img/kakaologin.png";
import YouGotITLogo from "../../../img/YouGotITLogo.png";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import './style.scss';
import { signInApi, signUpApi, findEmail } from "../../../apis/index.tsx";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [openIdDialog, setOpenIdDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  const handleIdDialogOpen = () => {
    setOpenIdDialog(true);
  };

  const handleIdDialogClose = () => {
    setOpenIdDialog(false);
  };

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
  };

  const handleFindEmail = async () => {
    try {
      const { email } = await findEmail('사용자의 이름', '사용자의 전화번호');
      console.log('찾은 이메일:', email);
    } catch (error) {
      console.error(error.message);
    }
  };

  const signInHandler = async (e) => {
    e.preventDefault();

    if(email.length === 0 || password.length === 0) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }

    const data = {
      email,
      password
    };
    console.log(data);
    try {
      const signInResponse = await signInApi(data);

      if(signInResponse.result){
        navigate("/");
      }else{
        alert("이메일 혹은 패스워드를 잘못 입력하셨거나 등록되지 않은 이메일입니다.");
      }
    } catch (error) {
      
    }
  }

  return (
    <div className="auth">
      <form method="POST" onSubmit={signInHandler}>
        <div className="logo">
          <Link to="/">
            <div className="logo">
              <img src={YouGotITLogo} alt="YouGotIT 로고" />
            </div>
          </Link>
        </div>
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>로그인</button>
        <div className="button-group">
          <Button className="findEmail" onClick={handleIdDialogOpen}>
            아이디 찾기
          </Button>
          <Button className="findPassword" onClick={handlePasswordDialogOpen}>
            비밀번호 찾기
          </Button>
          <button
            className="signUp"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/signUp";
            }}
          >
            회원가입
          </button>
        </div>
        <p>This is an error!</p>
        <div className="simple-signIn">
          <h3>소셜 로그인</h3>
          <img src={KakaoLogin} alt="" />
        </div>

        {/* 아이디 찾기 Dialog */}
        <Dialog open={openIdDialog} onClose={handleIdDialogClose}>
          <DialogTitle>이메일 찾기</DialogTitle>
          <DialogContent>
            {/* Add your content for 아이디 찾기 here */}
            <TextField label="이름" fullWidth name="UserName"/>
            <TextField label="전화번호" fullWidth name="UserCellPhone" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleIdDialogClose}>닫기</Button>
            <Button onClick={handleFindEmail}>찾기</Button>
          </DialogActions>
        </Dialog>

        {/* 비밀번호 찾기 Dialog */}
        <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogContent>
            {/* Add your content for 비밀번호 찾기 here */}
            <TextField label="이메일" fullWidth />
            <TextField label="전화번호" fullWidth />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose}>닫기</Button>
            <Button onClick={handlePasswordDialogClose}>찾기</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default SignIn;
