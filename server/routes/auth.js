const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
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
    const email = req.body.UserEmail;
    const password = req.body.Password;
    console.log("Email: " + email + " Password: " + password);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      conn.query(
        "SELECT u.UserEmail, u.Password FROM Users u WHERE u.UserEmail = ?",
        [email],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          if (result.length === 0) {
            console.log("cannot find user");
            res.status(404).send("User not found");
            return;
          }

          const hashedPassword = result[0].Password;

          if (bcrypt.compareSync(password, hashedPassword)) {
            console.log("success");
            req.session.email = email;

            if (req.session.email) {
              res.redirect("/");
            }
          } else {
            console.log("fail");
            res.status(401).send("Invalid password");
          }

          conn.release();
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
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
