const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

//전체 카테고리 출력
router.get("/all", (req, res) => {
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
router.get("/lectures/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;
  console.log(categoryID);

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
        l.LectureTitle,
        IFNULL(AVG(c2.Rating), 0) AS AverageRating, 
        l.LecturePrice ,
        i.InstructorName
      FROM 
          Lectures l
      JOIN
          LectureCategory lc ON l.LectureID = lc.LectureID
      JOIN 
          Category c ON c.CategoryID = lc.CategoryID
      JOIN 
          Instructor i ON i.InstructorID = l.InstructorID         
      LEFT JOIN 
          Comments c2 ON c2.LectureID = l.LectureID 
      WHERE 
          lc.CategoryID = ?
      GROUP BY 
          l.LectureID
      ORDER BY 
          AverageRating DESC;
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

module.exports = router;
