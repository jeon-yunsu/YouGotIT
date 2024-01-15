const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const mysql = require("../database/mysql");

//메인페이지에서 인기강의, 신규강의, 유저정보 가져옴
router.get("/", (req, res) => {

  const userId = req.headers["userid"];

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
    const hotLectureQuery = `
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

    const newLectureQuery = `
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

    const userInfoQuery = `
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

    // 병렬로 두 개의 쿼리 실행
    conn.query(hotLectureQuery, (error, hotLecture) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: "error",
          message: "Error fetching hot lectures"
        });
        return;
      }

      conn.query(newLectureQuery, (error, newLecture) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            status: "error",
            message: "Error fetching new lectures"
          });
          return;
        }
        conn.query(userInfoQuery, (error, userInfo) => {
          if (error) {
            console.error(error);
            res.status(500).json({
              status: "error",
              message: "Error fetching user info"
            });
            return;
          }
          console.log(userInfo);

          const combinedResults = {
            hotLecture: hotLecture,
            newLecture: newLecture,
            userInfo: userInfo
          };

          res.status(200).json({
            status: "success",
            data: combinedResults
          });
  
          // MySQL 연결 종료
          conn.release();
        });
      });
    });
  });
});


module.exports = router;
