const express = require("express");
const mysql = require("./mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

router.get("/", (req, res) => {
  try {
    console.log(req.session);
    res.render("home.ejs", { isLogined: req.session.email });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

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

router.get("/api/auth/signIn", (req, res) => {
  try {
    res.render("signIn.ejs");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/api/auth/signUp", (req, res) => {
  try {
    res.render("signUp.ejs");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// 인기 강의 출력
router.get("/api/hotLecture", (req, res) => {
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
      l.LectureID,
      l.LectureImageURL,
      l.Title,
      i.InstructorName,
      l.LecturePrice,
      AVG(c.Rating) AS AverageRating
    FROM
        Lectures l
    JOIN
        Instructor i ON l.InstructorID = i.InstructorID
    JOIN 
        Comments c ON l.LectureID = c.LectureID 
    GROUP BY
        l.LectureImageURL, l.Title, i.InstructorName, l.LecturePrice
    ORDER BY
        AverageRating DESC
    LIMIT 5;
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

// 최신 강의 출력
router.get("/api/newLecture", (req, res) => {
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
        l.LectureID,
        l.LectureImageURL,
        l.Title,
        i.InstructorName,
        l.LecturePrice,
        AVG(c.Rating) AS AverageRating,
        l.UploadDate
      FROM
        Lectures l
      JOIN
        Instructor i ON l.InstructorID = i.InstructorID
      JOIN 
        Comments c ON l.LectureID = c.LectureID 
      GROUP BY
        l.LectureID, l.LectureImageURL, l.Title, i.InstructorName, l.LecturePrice, l.UploadDate
      ORDER BY l.UploadDate DESC
      LIMIT 5;
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

// 사용자 정보 가져오기(메인페이지)
router.get("/api/user", (req, res) => {
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

// 검색기능
router.get("/api/search-list/:searchWord", (req, res) => {
  const searchWord = req.params.searchWord;

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
        l.LectureID,
        l.LectureImageURL,
        l.Title,
        l.LecturePrice,
        AVG(c.Rating) AS AverageRating
      FROM
        Lectures l
      JOIN
        LectureCategory lc ON l.LectureID = lc.LectureID
      JOIN 
        Comments c ON l.LectureID = c.LectureID 
      JOIN 
        Category c2 ON c2.CategoryID = lc.CategoryID 
      WHERE 
        l.Title LIKE '%${searchWord}%' OR c2.CategoryName LIKE '%${searchWord}%'
      GROUP BY
        l.LectureID, l.LectureImageURL, l.Title, l.LecturePrice
      ORDER BY
        AverageRating DESC;
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

//전체 카테고리 출력
router.get("/api/categories", (req, res) => {
  
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
          * 
      From
          Category c ;
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


//특정 카테고리 클릭시 해당 카테고리의 강의들을 평점순으로 출력
router.get("/api/categories/lectures/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;

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
        l.LectureID,
        l.LectureImageURL,
        l.Title,
        AVG(c2.Rating) AS AverageRating,
        l.LecturePrice 
      FROM 
        Lectures l
      JOIN
        LectureCategory lc ON l.LectureID = lc.LectureID
      JOIN 
        Category c ON c.CategoryID = lc.CategoryID
      JOIN 
        Comments c2 ON c2.LectureID = l.LectureID
      WHERE 
        lc.CategoryID = ?
      GROUP BY 
        l.LectureID
      ORDER BY AverageRating DESC ;
    `;

    conn.query(query, [categoryID], (error, results) => {
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


//회원가입
router.post("/api/auth/signUp", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const passwordCheck = req.body.passwordCheck;
  const phoneNumber = req.body.phoneNumber;
  const nickName = req.body.nickName;

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
router.post("/api/auth/signIn", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
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


// 사용자 정보 가져오기(마이페이지)
router.get("/api/userInfo", (req, res) => {
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
router.post("/api/userInfo/update-profileImage", async (req, res) => {
  try {
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
router.post("/api/userInfo/update-nickname", async (req, res) => {
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
router.post("/api/userInfo/update-cellphone", async (req, res) => {
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
router.post("/api/userInfo/update-introduction", async (req, res) => {
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
router.post("/api/userInfo/update-password", async (req, res) => {
  try {
    const userId = req.body.UserID;
    const password = req.body.Password;
    const newPassword = req.body.NewPassword;
    console.log("userId: " + userId + " Password: " + password + " newPassword: " + newPassword);
  

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

//회원탈퇴(외래키 제약조건 해제해야 함)
// router.post("/api/userInfo/delete-user", async (req, res) => {
//   try {
//     const userId = req.body.UserID;
//     const userEmail = req.body.UserEmail;
//     const inputPassword = req.body.Password;
//     console.log("userId: " + userId + " Password: " + inputPassword + " userEmail: " + userEmail);

//     mysql.getConnection((error, conn) => {
//       if (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       conn.query(
//         "SELECT UserID, Password FROM Users WHERE UserID = ? AND UserEmail = ?",
//         [userId, userEmail],
//         async (err, result) => {
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

//           if (await bcrypt.compare(inputPassword, hashedPassword)) {
//             conn.query("DELETE FROM Users WHERE UserID = ?",
//               [userId],
//               (err, result) => {
//                 console.log(result);
//                 if (err) {
//                   console.log(err);
//                   res.status(500).send("Internal Server Error");
//                   return;
//                 }
//                 res.status(200).send("User deleted successfully");
//               }
//             );
//           } else {
//             console.log("password does not match");
//             res.status(401).send("Password does not match");
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



router.post("/api/userInfo/delete-user", async (req, res) => {
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
        "SELECT UserID FROM Users WHERE UserID = ? AND UserEmail = ? AND Password = ?",
        [userId, userEmail, inputPassword],
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
          
          )

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
router.get("/api/user/cours", (req, res) => {
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


//장바구니 출력
router.get("/api/cartlist", (req, res) => {
  const userId = req.headers["userid"];

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
        l.LectureImageURL ,
        l.LectureID ,
        l.Title ,
        i.InstructorName ,
        l.LecturePrice ,
        c.CreateDate 
      FROM
        Lectures l 
      JOIN
        Cart c ON l.LectureID = c.LectureID 
      JOIN
        Users u ON c.UserID = u.UserID 
      JOIN 
        Instructor i ON l.InstructorID = i.InstructorID 
      WHERE 
        u.UserID = '${userId}'
      ORDER BY c.CreateDate desc;
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


//결제내역
router.get("/api/modify/payment", (req, res) => {
  const userId = req.headers["userid"];

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
          u.UserName,
          u.UserEmail,
          l.LectureID,
          l.Title,
          l.LectureImageURL,
          l.LecturePrice,
          p.PaymentDate,
          e.AttendanceRate
      FROM 
          Payments p
      JOIN 
          Users u ON p.UserID = u.UserID
      JOIN 
          Lectures l ON p.LectureID = l.LectureID
      JOIN 
          Enrollments e ON e.UserID = u.UserID AND e.LectureID = l.LectureID
      WHERE 
          u.UserID = '${userId}' AND e.PaymentStatus = TRUE
      ORDER BY p.PaymentDate DESC;
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



//강의 상세정보 출력(수강 신청 전)
router.get("/api/lecture/:lectureId", (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
          l.*,
          i.*,
          AVG(c.Rating) AS AverageRating
      FROM
          Lectures l
      JOIN
          Instructor i ON l.InstructorID = i.InstructorID
      JOIN 
          Comments c ON c.LectureID = l.LectureID 
      WHERE 
          l.LectureID = '${lectureId}'
      GROUP BY
          l.LectureID,
          l.InstructorID ,
          l.CommentID ,
          i.InstructorID;
    `;

    conn.query(query, [lectureId], (error, results) => {
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


//해당 강의의 카테고리 출력
router.get("/api/lecture/category/:lectureId", (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    // SQL 쿼리 실행
    const query = `
      SELECT DISTINCT 
          c.CategoryName
      FROM 
          Lectures l  
      JOIN
          LectureCategory lc ON l.LectureID = lc.LectureID 
      JOIN 
          Category c ON c.CategoryID = lc.CategoryID 
      WHERE 
          l.LectureID = '${lectureId}';
    `;

    conn.query(query, [lectureId], (error, results) => {
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


//목차 출력
router.get("/api/lecture/toc/:lectureId", (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
        lt.TOCID ,
        lt.Title 
      FROM 
        LectureTOC lt 
      WHERE 
        lt.LectureID = '${lectureId}';
    `;

    conn.query(query, [lectureId], (error, results) => {
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


//수강평 출력
router.get("/api/lecture/comment/:lectureId", (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
        c.*
      FROM 
        Comments c 
      WHERE 
        c.LectureID = '${lectureId}'
      ORDER BY WriteDate DESC ;
    `;

    conn.query(query, [lectureId], (error, results) => {
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


//강의 상세 정보(수강 신청 후)
router.get("/api/paidlecture/:lectureId", (req, res) => {
  // const userId = req.headers["userid"];
  const lectureId = req.params.lectureId;

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
        l.*,
        i.*,
        AVG(c.Rating),  
        e.AttendanceRate
      FROM
        Lectures l	
      JOIN
        Instructor i ON l.InstructorID = i.InstructorID
      JOIN
        Enrollments e ON l.LectureID = e.LectureID
      JOIN 
        Comments c ON c.LectureID = l.LectureID 
      WHERE
        l.LectureID = '${lectureId}'
      GROUP BY 
        l.LectureID,
        c.CommentID,
        e.EnrollmentID,
        i.InstructorID ;
    `;

    conn.query(query, [lectureId], (error, results) => {
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


//수강평 등록
router.post("/api/add-review", async (req, res) => {
  try {
    const userId = req.body.UserID;
    const lectureId = req.body.LectureID;
    const content = req.body.Content;
    const currentDate = new Date();
    const rating = req.body.Rating;

    console.log("Received data:", req.body);
    console.log("userId:", userId);
    console.log("lectureId:", lectureId);
    console.log("content:", content);
    console.log("currentDate:", currentDate);
    console.log("rating:", rating);
  
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }
      

      conn.query(
        "INSERT INTO Comments (UserID, LectureID, Content, WriteDate, Rating) VALUES (?, ?, ?, ?, ?);",
        [userId, lectureId, content, currentDate, rating],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // 쿼리 완료 후 연결 해제
          conn.release();

          // 응답 보내기
          res.status(200).send("Review added successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error3");
  }
});


//수강평 수정
router.post("/api/update-review", async (req, res) => {
  try {
    const CommentID = req.body.CommentID;
    const content = req.body.Content;
    const currentDate = new Date();
    const rating = req.body.Rating;
  
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }
      

      conn.query(
        "UPDATE Comments c SET c.Content = ?, c.UpdateDate = ?, c.Rating = ? WHERE c.CommentID = ?;",
        [content, currentDate, rating, CommentID],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // 쿼리 완료 후 연결 해제
          conn.release();

          // 응답 보내기
          res.status(200).send("Review added successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error3");
  }
});


//장바구니 담기
router.post("/api/add-cart", async (req, res) => {
  try {
    const userId = req.body.UserID;
    const lectureId = req.body.LectureID;
    const currentDate = new Date();
  
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }
      

      conn.query(
        "INSERT INTO Cart (UserID, LectureID, CreateDate) VALUES (?, ?, ?);",
        [userId, lectureId, currentDate],
        (err, result) => {
          console.log(result);
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // 쿼리 완료 후 연결 해제
          conn.release();

          // 응답 보내기
          res.status(200).send("Cart added successfully");
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error3");
  }
});


//해당 강의의 목차와 정보를 출력
router.get("/api/lectures/:lectureId/watch", (req, res) => {
  console.log(req.params);
  const lectureId = req.params.lectureId;

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
        lm.*,
        lt.*
      FROM 
        LecturesMaterial lm 
      JOIN
        LectureTOC lt ON lt.TOCID = lm.TOCID 
      JOIN
        Lectures l ON l.LectureID = lt.LectureID 
      WHERE 
        l.LectureID = '${lectureId}';
    `;

    conn.query(query, [lectureId], (error, results) => {
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

module.exports = router;
