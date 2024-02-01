const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId")

// 강의 상세정보 출력(수강 신청 전)
// router.get("/:lectureId", (req, res) => {
//   const lectureId = req.params.lectureID;
//   console.log(lectureId);

//   // MySQL 연결
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // SQL 쿼리 실행
//     const query = `
//         SELECT
//             l.*,
//             i.*,
//             AVG(c.Rating) AS AverageRating
//         FROM
//             Lectures l
//         JOIN
//             Instructor i ON l.InstructorID = i.InstructorID
//         JOIN
//             Comments c ON c.LectureID = l.LectureID
//         WHERE
//             l.LectureID = '${lectureId}'
//         GROUP BY
//             l.LectureID,
//             l.InstructorID ,
//             l.CommentID ,
//             i.InstructorID;
//       `;

//     conn.query(query, [lectureId], (error, results) => {
//       console.log(results);
//       if (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.json(results);
//       }

//       // MySQL 연결 종료
//       conn.release();
//     });
//   });
// });

// //해당 강의의 카테고리 출력
// router.get("/category/:lectureId", (req, res) => {
//   // const userId = req.headers["userid"];
//   const lectureId = req.params.lectureID;

//   // MySQL 연결
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // SQL 쿼리 실행
//     const query = `
//         SELECT DISTINCT
//             c.CategoryName
//         FROM
//             Lectures l
//         JOIN
//             LectureCategory lc ON l.LectureID = lc.LectureID
//         JOIN
//             Category c ON c.CategoryID = lc.CategoryID
//         WHERE
//             l.LectureID = '${lectureId}';
//       `;

//     conn.query(query, [lectureId], (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.json(results);
//       }

//       // MySQL 연결 종료
//       conn.release();
//     });
//   });
// });

// //목차 출력
// router.get("/toc/:lectureId", (req, res) => {
//   // const userId = req.headers["userid"];
//   const lectureId = req.params.lectureID;

//   // MySQL 연결
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // SQL 쿼리 실행
//     const query = `
//         SELECT
//           lt.TOCID ,
//           lt.Title
//         FROM
//           LectureTOC lt
//         WHERE
//           lt.LectureID = '${lectureId}';
//       `;

//     conn.query(query, [lectureId], (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.json(results);
//       }

//       // MySQL 연결 종료
//       conn.release();
//     });
//   });
// });

// //수강평 출력
// router.get("/comment/:lectureId", (req, res) => {
//   // const userId = req.headers["userid"];
//   const lectureId = req.params.lectureID;

//   // MySQL 연결
//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // SQL 쿼리 실행
//     const query = `
//         SELECT
//           c.*,
//           u.UserNickname ,
//           u.ProfileImage 
//         FROM
//           Comments c
//         JOIN
//           Users u ON u.UserID = c.UserID  
//         WHERE
//           c.LectureID = '${lectureId}'
//         ORDER BY WriteDate DESC ;
//       `;

//     conn.query(query, [lectureId], (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//       } else {
//         res.json(results);
//       }

//       // MySQL 연결 종료
//       conn.release();
//     });
//   });
// });

// router.get("/:lectureId", async (req, res) => {
//   const lectureId = req.params.lectureId;

//   mysql.getConnection((error, conn) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("내부 서버 오류");
//       return;
//     }

//     // 강의 정보, 강사 정보, 평균 평점, 카테고리, 목차, 댓글을 한 번에 가져오는 SQL 쿼리
//     const query = `
//       SELECT
//         l.*,
//         i.*,
//         AVG(comments.Rating) AS AverageRating,
//         GROUP_CONCAT(DISTINCT category.CategoryName) AS Categories,
//         GROUP_CONCAT(DISTINCT lt.TOCID, ':', lt.Title) AS TOCs,
//         GROUP_CONCAT(DISTINCT comments.CommentID, ':', comments.Content, ':', comments.WriteDate, ':', comments.Rating) AS Comments
//       FROM
//         Lectures l
//       JOIN
//         Instructor i ON l.InstructorID = i.InstructorID
//       LEFT JOIN
//         Comments comments ON comments.LectureID = l.LectureID 
//       LEFT JOIN
//         LectureCategory lc ON lc.LectureID = l.LectureID
//       LEFT JOIN
//         Category category ON category.CategoryID = lc.CategoryID
//       LEFT JOIN
//         LectureTOC lt ON lt.LectureID = l.LectureID
//       WHERE 
//         l.LectureID = ?
//       GROUP BY
//         l.LectureID, l.InstructorID;
//     `;

//     conn.query(query, [lectureId], (error, results) => {
//       console.log(results);
//       if (error) {
//         console.error(error);
//         res.status(500).send("내부 서버 오류");
//       } else {
//         res.json(results);
//       }

//       // MySQL 연결 종료
//       conn.release();
//     });
//   });
// });



router.get("/:lectureId", (req, res) => {
  const lectureId = req.params.lectureId;
  
  try {
    // MySQL 연결
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      // SQL 쿼리 실행
      const lectureQuery = `
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
          l.LectureID = ${lectureId}
        GROUP BY
          l.LectureID,
          l.InstructorID,
          l.CommentID,
          i.InstructorID;
      `;

      const TOCQuery = `
        SELECT
          lt.TOCID ,
          lt.Title ,
          lt.ParentTOCID
        FROM
          LectureTOC lt
        WHERE
          lt.LectureID = ${lectureId};
      `;

      const categoryQuery = `
        SELECT DISTINCT
          c.CategoryName
        FROM
          Lectures l
        JOIN
          LectureCategory lc ON l.LectureID = lc.LectureID
        JOIN
          Category c ON c.CategoryID = lc.CategoryID
        WHERE
          l.LectureID = ${lectureId};
      `;

      const commentQuery = `
        SELECT
          c.CommentID,
          c.UserID,
          c.LectureID,
          c.Content,
          c.WriteDate,
          c.UpdateDate,
          c.Rating,
          u.UserNickname ,
          u.ProfileImage 
        FROM
          Comments c
        JOIN
          Users u ON u.UserID = c.UserID  
        WHERE
          c.LectureID = ${lectureId}
        ORDER BY WriteDate DESC ;
      `;

      // 각각의 쿼리 비동기적으로 실행
      conn.query(lectureQuery, (error, lectureResult) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        conn.query(TOCQuery, (error, tocResult) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          conn.query(categoryQuery, (error, categoryResult) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: "Internal Server Error" });
              return;
            }

            conn.query(commentQuery, (error, commentResult) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
                return;
              }

              res.json({
                lecture: lectureResult,
                toc: tocResult,
                categories: categoryResult,
                comments: commentResult,
              });
              // console.log("commentResult", commentResult[0]);
              // console.log("tocResult", tocResult[0]);
              // console.log("categoryResult", categoryResult);
              // console.log("lectureResult", lectureResult[0]);

              // MySQL 연결 종료
              conn.release();
            });
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});







//강의 상세 정보(수강 신청 후)
router.get("/paid/:lectureId", (req, res) => {
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
router.post("/add-review", async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const lectureId = req.body.LectureID;
    const content = req.body.Content;
    const rating = req.body.Rating;

    console.log("userId:", userId);
    console.log("lectureId:", lectureId);
    console.log("content:", content);
    console.log("rating:", rating);

    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      conn.query(
        "INSERT INTO Comments (UserID, LectureID, Content, WriteDate, Rating) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?);",
        [userId, lectureId, content, rating],
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
router.post("/update-review", async (req, res) => {
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

//동영상 시청 페이지
router.get("/:lectureId/watch", (req, res) => {
  const lectureId = req.params.lectureId;
  const userId = verifyTokenAndGetUserId(req, res);

  mysql.getConnection((error, conn) => {
    if (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const query = `
      SELECT
        lm.*,
        lt.*,
        e.AttendanceRate,
        u.UserID ,
        l.LectureTitle 
      FROM 
        LecturesMaterial lm 
      JOIN
        LectureTOC lt ON lt.TOCID = lm.TOCID 
      JOIN
        Lectures l ON l.LectureID = lt.LectureID 
      JOIN 
        Enrollments e  ON e.LectureID = lt.LectureID 
      JOIN 
        Users u ON u.UserID = e.UserID 
      WHERE 
        l.LectureID = '${lectureId}' AND u.UserID = '${userId}';
    `;

    conn.query(query, [lectureId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        res.json(results);
        console.log(results);
      }

      // 여기에서 응답을 보내고 난 후에 연결을 종료해야 합니다.
      conn.release();
    });
  });
});

//강의의 수강 여부 확인

module.exports = router;
