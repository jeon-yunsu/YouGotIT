const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
router.use(bodyParser.json());

router.get("/signIn", (req, res) => {
  try {
    res.render("signIn.ejs");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/signUp", (req, res) => {
  try {
    res.render("signUp.ejs");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

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
    console.log("이메일: " + email + " 비밀번호: " + password);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("내부 서버 오류");
        return;
      }

      conn.query(
        "SELECT u.UserID, u.UserEmail, u.Password FROM Users u WHERE u.UserEmail = ?",
        [email],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("내부 서버 오류");
            return;
          }

          if (result.length === 0) {
            console.log("사용자를 찾을 수 없음");
            res.status(404).send("사용자를 찾을 수 없음");
            return;
          }

          const hashedPassword = result[0].Password;

          if (bcrypt.compareSync(password, hashedPassword)) {
            

            const token = jwt.sign(
              { userID: result[0].UserID },
              key,
              { expiresIn: "1h" }
            );
            
            // 토큰을 쿠키에 저장
            res.cookie("usertoken", token);
            res.send({ success: true });

            console.log("토큰: " + token);

          } else {
            console.log("실패");
            res.status(401).send("잘못된 비밀번호");
          }

          conn.release();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("내부 서버 오류");
  }
});


//로그아웃
router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
