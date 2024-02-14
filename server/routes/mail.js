const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require("path");
const qs = require("qs");
const nodemailer = require("nodemailer");
router.use(bodyParser.json());
const crypto = require("crypto");

const generateEmailVerificationToken = () => {
  const tokenBytes = crypto.randomBytes(3);
  const token = tokenBytes.toString("hex").slice(0, 6);
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);
  return { token, expires };
};

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yunsu9039@gmail.com", // 이메일 주소
    pass: "lobw hjvy joya yggv", // 이메일 비밀번호
  },
});

router.post("/email_certification", async (req, res) => {
  const email = req.body.UserEmail;
  const result = generateEmailVerificationToken();
  const token = result.token;

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "내부 서버 오류" });
      return;
    }

    conn.query(
      "INSERT INTO EmailAuth(UserEmail, token) values(?, ?)",
      [email, token],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "내부 서버 오류" });
          return;
        }
      }
    );
  });

  const mailOptions = {
    from: "You Got IT Company <yunsu9039@gmail.com>",
    to: email,
    subject: "You Got IT 인증 메일입니다.",
    html: `<p>Please use the following code to verify your email address:</p>
                <p><strong>${token}</strong></p>
                <p>This code will expire in 24 hours.</p>`,
  };

  smtpTransport.sendMail(mailOptions, (err, response) => {
    console.log(response);
    // 첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
    if (err) {
      res.json({ ok: false, msg: "메일 전송에 실패하였습니다." });
      smtpTransport.close(); // 전송종료
      return;
    } else {
      res.json({
        ok: true,
        msg: "메일 전송에 성공하였습니다.",
        token: token, // 생성된 토큰을 클라이언트로 전송
      });
      smtpTransport.close(); // 전송종료
      return;
    }
  });
});

router.post("/verify-email", (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  console.log("email", email);
  console.log("token", token);

  // 데이터베이스에서 이메일과 토큰을 검색하여 일치하는지 확인
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "내부 서버 오류" });
      return;
    }

    conn.query(
      "SELECT * FROM EmailAuth WHERE UserEmail = ? AND token = ?",
      [email, token],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "내부 서버 오류" });
          return;
        }

        if (result.length > 0) {
          // 인증 성공: 토큰 만료 여부 확인
          const now = new Date();
          const expires = result[0].expires;
          if (now > expires) {
            // 토큰이 만료된 경우
            conn.query(
              "DELETE FROM EmailAuth WHERE UserEmail = ?",
              [email],
              (error, result) => {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "내부 서버 오류" });
                  return;
                }
                res.json({ success: false, message: "토큰이 만료되었습니다." });
                return;
              }
            );
          }

          // 토큰이 유효한 경우: 데이터베이스에서 해당 이메일과 관련된 토큰 삭제
          conn.query(
            "DELETE FROM EmailAuth WHERE UserEmail = ?",
            [email],
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "내부 서버 오류" });
                return;
              }
              // 인증 성공 메시지 전송
              res.json({
                success: true,
                message: "이메일 인증이 완료되었습니다.",
              });
            }
          );
        } else {
          // 이메일과 토큰이 일치하지 않는 경우: 인증 실패
          res.json({
            success: false,
            message: "이메일 또는 토큰이 올바르지 않습니다.",
          });
        }
      }
    );
  });
});

module.exports = router;
