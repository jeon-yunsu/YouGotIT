const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");
const kakaoAuth = require("../middleware/kakaoAuth");
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

router.use(bodyParser.json());

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

//카카오 회원가입
router.post("/kakaologin", (req, res) => {
  const email = req.body.UserEmail;
  const name = req.body.UserName;
  const password = req.body.Password;
  const phoneNumber = req.body.UserCellPhone;
  const nickName = req.body.UserNickname;

  // console.log(
  //   email +
  //     " " +
  //     name +
  //     " " +
  //     password +
  //     " " +
  //     passwordCheck +
  //     " " +
  //     phoneNumber +
  //     " " +
  //     nickName
  // );

  // if (password !== passwordCheck) {
  //   console.log("비밀번호가 일치하지 않습니다.");
  //   res.redirect("/signUp");
  // }

  //패스워드 암호화
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      // console.log(err);
      return;
    }

    mysql.getConnection((error, conn) => {
      console.log("Connection success");

      if (error) {
        // console.log(error);
        return;
      }

      conn.query(
        "INSERT INTO Users(UserEmail, UserName, Password, UserCellPhone, UserNickname) VALUES(?,?,?,?,?);",
        [email, name, hashedPassword, phoneNumber, nickName],
        (err, result) => {
          if (err) {
            // console.log(err);
            return;
          }
          res.json(result);
        }
      );
      conn.release();
    });
  });
  res.redirect("/");
});

//일반 회원가입
router.post("/signUp", (req, res) => {
  const email = req.body.UserEmail;
  const name = req.body.UserName;
  const password = req.body.Password;
  const passwordCheck = req.body.PasswordCheck;
  const phoneNumber = req.body.UserCellPhone;
  const nickName = req.body.UserNickname;

  console.log(
    email +
      " " +
      name +
      " " +
      password +
      " " +
      passwordCheck +
      " " +
      phoneNumber +
      " " +
      nickName
  );

  if (password !== passwordCheck) {
    console.log("비밀번호가 일치하지 않습니다.");
    res.redirect("/signUp");
  }

  //패스워드 암호화
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return;
    }

    mysql.getConnection((error, conn) => {
      console.log("Connection success");

      if (error) {
        console.log(error);
        return;
      }

      conn.query(
        "INSERT INTO Users(UserEmail, UserName, Password, UserCellPhone, UserNickname) VALUES(?,?,?,?,?);",
        [email, name, hashedPassword, phoneNumber, nickName],
        (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("success");
        }
      );
      conn.release();
    });
  });
  res.redirect("/");
});

// 로그인
router.post("/signIn", async (req, res) => {
  try {
    const key = process.env.JWT_SECRET;
    const email = req.body.UserEmail;
    const password = req.body.Password;

    console.log("email: ", email, "password: ", password);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "내부 서버 오류" });
        return;
      }

      conn.query(
        "SELECT u.UserID, u.UserEmail, u.UserName, u.ProfileImage, u.Password FROM Users u WHERE u.UserEmail = ?",
        [email],
        (err, result) => {
          console.log("result", result);
          if (err) {
            console.log(err);
            res.status(500).json({ error: "내부 서버 오류" });
            return;
          }

          if (result.length === 0) {
            console.log("등록되지 않은 이메일입니다.");
            res.status(404).json({ error: "등록되지 않은 이메일입니다." });
            return;
          }

          const hashedPassword = result[0].Password;
          console.log("hashedPassword", hashedPassword);

          if (bcrypt.compareSync(password, hashedPassword)) {
            const token = jwt.sign({ userID: result[0].UserID }, key, {
              expiresIn: "2h",
            });

            // 토큰을 쿠키에 저장
            res.cookie("userToken", token);

            // 비밀번호를 제외한 사용자 정보만 응답으로 보냄
            const userData = {
              UserID: result[0].UserID,
              UserEmail: result[0].UserEmail,
              UserName: result[0].UserName,
              ProfileImage: result[0].ProfileImage,
            };
            res.json({ success: true, userData });
          } else {
            console.log("비밀번호가 일치하지 않습니다.");
            res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
          }

          conn.release();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "내부 서버 오류" });
  }
});

//로그아웃
router.get("/logout", (req, res) => {
  try {
    // 클라이언트로부터 쿠키를 얻기 위해 request.cookies 사용
    const cookies = req.cookies;

    if (cookies !== null) {
      for (const userToken in cookies) {
        if (cookies.hasOwnProperty(userToken)) {
          // 쿠키를 삭제하는 방식으로 수정
          res.clearCookie(userToken);
        }
      }
    }

    // 클라이언트에게 로그아웃 성공을 알리는 응답을 보냄
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("로그아웃 중 오류:", error);
    res.status(500).send("Internal Server Error");
  }
});

// 닉네임 중복 검사
router.get("/duplication-nickname", (req, res) => {
  const nickname = req.query.nickname;
  console.log(nickname);

  try {
    mysql.getConnection((error, conn) => {
      if (error) {
        console.error(error);
        res.status(500).send("내부 서버 오류");
        return;
      }

      conn.query(
        "SELECT UserNickname FROM Users WHERE UserNickname = ?",
        [nickname],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("내부 서버 오류");
            return;
          }
          if (result.length > 0) {
            // 닉네임이 이미 존재함
            res.json({ isDuplicate: true });
          } else {
            // 닉네임이 중복되지 않음
            res.json({ isDuplicate: false });
          }
          conn.release();
        }
      );
    });
  } catch (error) {
    console.error("닉네임 중복 확인 중 오류 발생:", error);
    res.status(500).send("내부 서버 오류");
  }
});

//전화번호 중복 체크
router.get("/duplication-cellphone", async (req, res) => {
  const cellphone = req.query.cellphone;
  console.log(cellphone);

  try {
    mysql.getConnection((error, conn) => {
      if (error) {
        console.error(error);
        res.status(500).send("내부 서버 오류");
        return;
      }
      conn.query(
        "SELECT u.UserCellPhone FROM Users u WHERE u.UserCellPhone = ?",
        [cellphone],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("내부 서버 오류");
            return;
          }
          if (result.length > 0) {
            // 전화번호가 이미 존재함
            res.json({ isDuplicate: true });
          } else {
            // 전화번호가 중복되지 않음
            res.json({ isDuplicate: false });
          }
          conn.release();
        }
      );
    });
  } catch (error) {
    console.error("전화번호 중복 확인 중 오류 발생:", error);
    res.status(500).send("내부 서버 오류");
  }
});

//이메일 중복 체크
router.get("/duplication-email", async (req, res) => {
  const email = req.query.email;
  console.log(email);

  try {
    mysql.getConnection((error, conn) => {
      if (error) {
        console.error(error);
        res.status(500).send("내부 서버 오류");
        return;
      }
      conn.query(
        "SELECT u.UserEmail FROM Users u WHERE u.UserEmail = ?",
        [email],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("내부 서버 오류");
            return;
          }
          if (result.length > 0) {
            // 이메일이 이미 존재함
            res.json({ isDuplicate: true });
          } else {
            // 이메일이 중복되지 않음
            res.json({ isDuplicate: false });
          }
          conn.release();
        }
      );
    });
  } catch (error) {
    console.error("전화번호 중복 확인 중 오류 발생:", error);
    res.status(500).send("내부 서버 오류");
  }
});

router.get("/kakao", (req, res) => {
  // 사용자를 Kakao의 인증 엔드포인트로 리다이렉션합니다.
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(kakaoAuthUrl);
});


router.get("/kakao/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const registerationType = 1;
    let UserEmail = "";
    let UserName = "";
    let UserCellPhone = "";
    let UserNickname = "";
    let Password = "";
    let PasswordCheck = "";

    const tokenUrl = "https://kauth.kakao.com/oauth/token";
    const params = {
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID,
      client_secret: KAKAO_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    };

    const response = await axios.post(tokenUrl, qs.stringify(params), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;

    if (accessToken != null && accessToken) {
      const profileUrl = "https://kapi.kakao.com/v2/user/me";
      const profileResponse = await axios.get(profileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      Password = profileResponse.data.id.toString();
      PasswordCheck = profileResponse.data.id.toString();
      UserEmail = profileResponse.data.kakao_account.email;
      UserName = profileResponse.data.kakao_account.profile.nickname;
      UserCellPhone =
        "0" +
        profileResponse.data.kakao_account.phone_number.replace(
          /[\s+\-+]|82/g,
          ""
        );
      UserNickname = profileResponse.data.kakao_account.profile.nickname;

    } else {
      return res.redirect("http://localhost:3000");
    }
  } catch (error) {
    console.error("Kakao 로그인 오류:", error);
    return res.status(500).send("Kakao 로그인 중 오류가 발생했습니다.");
  }
});


// router.post('/kakao', async (req, res) => {
//   try{
//     let userEmail = "";
//     let userNickName = "";
//     console.log("1")
//     console.log("req.body.access_token", req.body.access_token)
//     if (req.body.access_token) {
//     //초기 로그인
//       // const result = await kakaoAuth.getProfile(req.body.access_token);
//       const result = await kakaoAuth.getProfile(req.body.access_token);
//       const kakaoUser = JSON.parse(result).kakao_account;
//       userEmail = kakaoUser.email;
//       userNickName = kakaoUser.profile.nickname;
//     } else {
//     //자동 로그인
//       const user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, {
//         ignoreExpiration: true,
//       });
//       userEmail = user.email;
//     }

//     const [user, created] = await User.findOrCreate({
//       where: { email: userEmail },
//       defaults: {
//         socialType: 'kakao',
//         nickName: userNickName,
//         kakaoToken: req.body.access_token
//       },
//       attributes: ['id', 'nickName'],
//     });

//     let responseData = {
//       success: true,
//       user,
//     };

//     if (req.body.access_token) {
//       const token = jwt.sign({
//         id: user.id,
//         email: userEmail,
//       }, process.env.JWT_SECRET, {
//         issuer: 'bbangsoon',
//       });
//       responseData.jwt = token;
//     }

//     return res.status(created? 201: 200).json(responseData);
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.toString(),
//     });
//   }
// });

module.exports = router;
