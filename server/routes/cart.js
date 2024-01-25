const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId")



//장바구니 담기
router.post("/add-lecture", async (req, res) => {
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

//장바구니 출력
router.get("/cartlist", (req, res) => {
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
        l.LectureImageURL ,
        l.LectureID ,
        l.LectureTitle ,
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

module.exports = router;
