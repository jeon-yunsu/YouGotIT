const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId");
const {VerificationToken} = require('../middleware/VerificationToken');

// // 사용자 정보 가져오기(메인페이지)
// router.get("/home", VerificationToken, function (req, res) {
//   const userId = verifyTokenAndGetUserId(req, res);

//   if (!userId) {
//     res.status(400).send("User ID not found in headers");
//     return;
//   }

//   // MySQL 연결
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({
//         status: "error",
//         message: "Internal Server Error",
//       });
//     }

//     const userInfoQuery = `
//         SELECT
//           u.UserID,
//           u.UserEmail,
//           u.UserNickname,
//           u.ProfileImage
//         FROM 
//           Users u
//         WHERE 
//           u.UserID = '${userId}';
//       `;

//     conn.query(userInfoQuery, (error, userInfo) => {
//       // MySQL 연결 종료
//       conn.release();

//       if (error) {
//         console.error(error);
//         return res.status(500).json({
//           status: "error",
//           message: "Error fetching user info",
//           error: error.message,
//         });
//       }
//       const user = userInfo[0];
//       res.json(user);
//       console.log("user:  " + JSON.stringify(user));
//     });
//   });
// });
router.get("/home", VerificationToken, (req, res) => {
  console.log("Home");
});


// 사용자 정보 가져오기(마이페이지)
router.get("/mypage",VerificationToken, (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send("User ID not found in headers");
    return;
  }

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    // SQL 쿼리 실행
    const query = `
    SELECT 
        u.UserID ,
        u.UserEmail ,
        u.UserName, 
        u.ProfileImage, 
        u.Introduction, 
        u.UserNickname
    FROM 
        Users u 
    WHERE 
        u.UserID = '${userId}';
    `;

    conn.query(query, (error, results) => {
      console.log("마이페이지", results);
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(results);
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

//사용자 프로필 이미지 변경
router.post("/update-profileImage", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const profileImage = req.files.ProfileImage;
    console.log(profileImage, userId);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      conn.query(
        "UPDATE Users u SET u.ProfileImage = ? WHERE u.UserID = ?",
        [profileImage, userId],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
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

//닉네임 수정
router.post("/update-nickname", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const userNickname = req.body.UserNickname;
    console.log("userNickname:", userNickname, "userId", userId);

    // 1. 중복 체크를 위한 쿼리 실행
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("내부 서버 오류");
        return;
      }

      conn.query(
        "SELECT COUNT(*) AS count FROM Users WHERE UserNickname = ? AND UserID <> ?",
        [userNickname, userId],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("내부 서버 오류");
            conn.release();
            return;
          }

          const nicknameCount = result[0].count;
          if (nicknameCount > 0) {
            // 닉네임이 이미 사용 중인 경우
            res.status(400).send("이미 사용 중인 닉네임");
            conn.release();
            return;
          }

          // 2. 닉네임 업데이트 쿼리 실행
          conn.query(
            "UPDATE Users SET UserNickname = ? WHERE UserID = ?",
            [userNickname, userId],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.log(updateErr);
                res.status(500).send("내부 서버 오류");
                conn.release();
                return;
              }

              console.log(updateResult);
              res.send(JSON.stringify(updateResult));
              conn.release();
            }
          );
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("내부 서버 오류");
  }
});

//전화번호 변경
router.post("/update-cellphone", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const userCellPhone = req.body.UserCellPhone;
    console.log("userCellPhone:", userCellPhone, "userId:", userId);

    // 중복 체크를 위한 쿼리 실행
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("내부 서버 오류");
        return;
      }

      conn.query(
        "SELECT COUNT(*) AS count FROM Users u WHERE u.UserCellPhone = ? AND u.UserID <> ?",
        [userCellPhone, userId],
        (selectErr, selectResult) => {
          if (selectErr) {
            console.log(selectErr);
            res.status(500).send("내부 서버 오류");
            conn.release();
            return;
          }

          const phoneCount = selectResult[0].count;
          console.log("phoneCount:", phoneCount);

          if (phoneCount > 0) {
            // 이미 사용 중인 휴대폰 번호인 경우
            res.status(400).send("이미 사용 중인 휴대폰 번호");
            conn.release();
            return;
          }

          // 중복이 없는 경우 휴대폰 번호 업데이트 쿼리 실행
          conn.query(
            "UPDATE Users u SET u.UserCellPhone = ? WHERE u.UserID = ?",
            [userCellPhone, userId],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.log(updateErr);
                res.status(500).send("내부 서버 오류");
                conn.release();
                return;
              }

              console.log(updateResult);
              res.send(JSON.stringify(updateResult));
              conn.release();
            }
          );
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("내부 서버 오류");
  }
});

//유저 소개 변경
router.post("/update-introduction", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const introduction = req.body.Introduction;
    console.log(introduction, userId);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      conn.query(
        "UPDATE Users u SET u.Introduction = ? WHERE u.UserID = ?",
        [introduction, userId],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // 쿼리 완료 후에 연결을 해제합니다.
          conn.release();

          // 성공적으로 업데이트되었음을 응답합니다.
          res.status(200).send("Introduction updated successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//비밀번호 변경
// router.post("/update-password", async (req, res) => {
//   try {
//     const userId = req.body.UserID;
//     const password = req.body.Password;
//     const passwordCheck = req.body.PasswordCheck;
//     const newPassword = req.body.NewPassword;
//     console.log(
//       "userId: " +
//         userId +
//         " Password: " +
//         password +
//         " newPassword: " +
//         newPassword+
//         "passwordCheck"+
//         passwordCheck
//     );

//     if (password !== passwordCheck) {
//       console.log("passwords do not match");
//       res.status(400).send("Passwords do not match");
//       return;
//     }

//     mysql.getConnection((error, conn) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       conn.query(
//         "SELECT UserID, Password FROM Users WHERE UserID = ?",
//         [userId],
//         (err, result) => {
//           console.log(result);
//           if (err) {
//             console.log(err);
//             res.status(500).send("Internal Server Error");
//             return;
//           }

//           if (result.length === 0) {
//             console.log("cannot find user");
//             res.status(404).send("User not found");
//             return;
//           }

//           const hashedPassword = result[0].Password;
//           if (bcrypt.compareSync(password, hashedPassword)) {
//             const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

//             conn.query(
//               "UPDATE Users SET Password = ? WHERE UserID = ?",
//               [hashedNewPassword, userId],
//               (err, result) => {
//                 console.log(result);
//                 if (err) {
//                   console.log(err);
//                   res.status(500).send("Internal Server Error");
//                   return;
//                 }
//                 res.status(200).send("Password changed successfully");
//               }
//             );
//           } else {
//             console.log("fail");
//             res.status(401).send("현재 비밀번호가 틀렸습니다");
//           }

//           conn.release();
//         }
//       );
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

//수강중인 강의 출력
router.get("/cours", (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);

  if (!userId) {
    res.status(400).send("User ID not found in headers");
    return;
  }

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    // SQL 쿼리 실행
    const query = `
        SELECT 
            u.UserID,
            l.LectureID,
            l.LectureTitle,
            l.LectureImageURL,
            e.AttendanceRate 
        FROM 
            Enrollments e  
        JOIN 
            Users u ON e.UserID = u.UserID 
        JOIN
            Lectures l ON e.LectureID = l.LectureID 
        WHERE 
            u.UserID = '${userId}' AND e.PaymentStatus = TRUE;
      `;

    conn.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(results);
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

// 회원탈퇴
router.post("/delete-user", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    console.log("asdasdad", userId);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        conn.release();
        return;
      }

      conn.query(
        "DELETE FROM Users WHERE UserID = ?",
        [userId],
        (err, result) => {
          conn.release();

          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          res.status(200).send("User deleted successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/find-email", async (req, res) => {
  try {
    const { UserName, UserCellPhone } = req.body;
    console.log(UserName, UserCellPhone);

    if (!UserName || !UserCellPhone) {
      return res
        .status(400)
        .json({ error: "이름과 전화번호를 모두 입력하세요." });
    }

    // MySQL 연결
    mysql.getConnection((error, conn) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // SQL 쿼리 실행
      const query = `
          SELECT 
              u.UserEmail 
          FROM 
              Users u 
          WHERE 
              u.UserName = '${UserName}' AND u.UserCellPhone = '${UserCellPhone}';
        `;

      conn.query(query, (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (results.length > 0) {
            const email = results[0].UserEmail;
            console.log(email);
          } else {
            res.json({ message: "일치하는 사용자가 없습니다." });
          }
        }

        // MySQL 연결 종료
        conn.release();
      });
    });
  } catch (error) {
    console.error("API 오류:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
