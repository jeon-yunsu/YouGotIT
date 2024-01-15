const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// 사용자 정보 가져오기(메인페이지)
router.get("/home", (req, res) => {
    console.log(req.headers);
    const userId = req.headers["userid"];
  
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
          u.UserID,
          u.UserEmail,
          u.UserNickname,
          u.ProfileImage
        FROM 
          Users u
        WHERE 
          u.UserID = '${userId}';
      `;
  
      conn.query(query, (error, results) => {
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
  
// 사용자 정보 가져오기(마이페이지)
router.get("/mypage", (req, res) => {
console.log(req.headers);
const userId = req.headers["userid"];

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
        console.log(req.body);
        const userId = req.body.UserID;
        const profileImage = req.body.ProfileImage;
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
    const userId = req.body.UserID;
    const userNickname = req.body.UserNickname;
    console.log(userNickname, userId);


    mysql.getConnection((error, conn) => {
    if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
    }

    conn.query(
        "UPDATE Users u SET u.UserNickname = ? WHERE u.UserID = ?",
        [userNickname, userId],
        (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(JSON.stringify(result));
        conn.release();
        }
    );
    });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
  
//전화번호 변경
router.post("/update-cellphone", async (req, res) => {
    try {
        const userId = req.body.UserID;
        const userCellPhone = req.body.UserCellPhone;
        console.log(userCellPhone, userId);


        mysql.getConnection((error, conn) => {
        if (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        conn.query(
            "UPDATE Users u SET u.userCellPhone = ? WHERE u.UserID = ?",
            [userCellPhone, userId],
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
  
//유저 소개 변경
router.post("/update-introduction", async (req, res) => {
    try {
        const userId = req.body.UserID;
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
            conn.release();
            }
        );
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});
  
//비밀번호 변경
router.post("/update-password", async (req, res) => {
    try {
        const userId = req.body.UserID;
        const password = req.body.Password;
        const passwordCheck = req.body.PasswordCheck;
        const newPassword = req.body.NewPassword;
        console.log("userId: " + userId + " Password: " + password + " newPassword: " + newPassword);


        if(password !== passwordCheck) {
            console.log("passwords do not match");
            res.status(400).send("Passwords do not match");
            return;
        }
        
        mysql.getConnection((error, conn) => {
        if (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        conn.query(
            "SELECT UserID, Password FROM Users WHERE UserID = ?",
            [userId],
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
                const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

                conn.query(
                "UPDATE Users SET Password = ? WHERE UserID = ?",
                [hashedNewPassword, userId],
                (err, result) => {
                    console.log(result);
                    if (err) {
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                    return;
                    }
                    res.status(200).send("Password changed successfully");
                }
                )

            } else {
                console.log("fail");
                res.status(401).send("현재 비밀번호가 틀렸습니다");
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

//수강중인 강의 출력
router.get("/cours", (req, res) => {
    const userId = req.headers["userid"];
  
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
            l.Title,
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
        const userId = req.body.UserID;
        const userEmail = req.body.UserEmail;
        const inputPassword = req.body.Password;
        console.log("userId: " + userId + " Password: " + inputPassword + " userEmail: " + userEmail);

        mysql.getConnection((error, conn) => {
        if (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        conn.query(
            "SELECT UserID, Password FROM Users WHERE UserID = ? AND UserEmail = ?",
            [userId, userEmail],
            async (err, result) => {
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

            if (await bcrypt.compare(inputPassword, hashedPassword)) {
                conn.query("DELETE FROM Users WHERE UserID = ?",
                [userId],
                (err, result) => {
                    console.log(result);
                    if (err) {
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                    return;
                    }
                    res.status(200).send("User deleted successfully");
                }
                );
            } else {
                console.log("password does not match");
                res.status(401).send("Password does not match");
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
  

router.post('/find-email', async (req, res) => {
    try {
      const { UserName, UserCellPhone } = req.body;
        console.log(UserName, UserCellPhone);
  
      if (!UserName || !UserCellPhone) {
        return res.status(400).json({ error: '이름과 전화번호를 모두 입력하세요.' });
      }
  
      // MySQL 연결
      mysql.getConnection((error, conn) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Internal Server Error' });
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
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            if (results.length > 0) {
              const email = results[0].UserEmail;
              console.log(email);
            } else {
              res.json({ message: '일치하는 사용자가 없습니다.' });
            }
          }
  
          // MySQL 연결 종료
          conn.release();
        });
      });
    } catch (error) {
      console.error('API 오류:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;