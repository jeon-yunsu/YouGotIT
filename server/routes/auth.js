const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
router.use(bodyParser.json());

// router.get("/signIn", (req, res) => {
//   try {
//     res.render("signIn.ejs");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/signUp", (req, res) => {
//   try {
//     res.render("signUp.ejs");
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//회원가입
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

          if (bcrypt.compareSync(password, hashedPassword)) {
            const token = jwt.sign(
              { userID: result[0].UserID },
              key,
              { expiresIn: "2h" }
            );

            // 토큰을 쿠키에 저장
            res.cookie("userToken", token);
            
            // 비밀번호를 제외한 사용자 정보만 응답으로 보냄
            const userData = {
              UserID: result[0].UserID,
              UserEmail: result[0].UserEmail,
              UserName: result[0].UserName,
              ProfileImage: result[0].ProfileImage
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




module.exports = router;
