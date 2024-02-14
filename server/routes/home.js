const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const mysql = require("../database/mysql");
const jwt = require("jsonwebtoken");

// 메인페이지에서 인기강의, 신규강의, 유저정보 가져옴
router.get("/", (req, res) => {

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error"
      });
      return;
    }

    // SQL 쿼리 실행
    const popularLectureQuery = `
      SELECT
        l.LectureID,
        l.LectureImageURL,
        l.LectureTitle,
        i.InstructorName,
        l.LecturePrice,
        AVG(c.Rating) AS AverageRating
      FROM
        Lectures l
      JOIN
        Instructor i ON l.InstructorID = i.InstructorID
      LEFT JOIN 
        Comments c ON l.LectureID = c.LectureID 
      GROUP BY
        l.LectureImageURL, l.LectureTitle, i.InstructorName, l.LecturePrice
      ORDER BY
        AverageRating DESC
      LIMIT 4;
    `;

    const newLectureQuery = `
      SELECT
        l.LectureID,
        l.LectureImageURL,
        l.LectureTitle,
        i.InstructorName,
        l.LecturePrice,
        AVG(c.Rating) AS AverageRating,
        l.UploadDate
      FROM
        Lectures l
      JOIN
        Instructor i ON l.InstructorID = i.InstructorID
      LEFT JOIN 
        Comments c ON l.LectureID = c.LectureID 
      GROUP BY
        l.LectureID, l.LectureImageURL, l.LectureTitle, i.InstructorName, l.LecturePrice, l.UploadDate
      ORDER BY l.UploadDate DESC
      LIMIT 4;
    `;

    // 병렬로 두 개의 쿼리 실행
    conn.query(popularLectureQuery, (error, popularLecture) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: "error",
          message: "Error fetching popular lectures",
          error: error.message 
        });
        return;
      }

      conn.query(newLectureQuery, (error, newLecture) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            status: "error",
            message: "Error fetching new lectures",
            error: error.message 
          });
          return;
        }

        // 두 쿼리에 대한 응답을 모두 클라이언트에게 보냄
        res.status(200).json({
          status: "success",
          data: {
            popularLecture: popularLecture,
            newLecture: newLecture
          }
        });

        // MySQL 연결 종료
        conn.release();
      });
    });
  });
});

module.exports = router;
