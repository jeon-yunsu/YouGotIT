const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

// 검색기능
router.get("/:searchWord", (req, res) => {
    const searchWord = req.params.searchWord;
    console.log(searchWord);
  
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
          l.LectureTitle LIKE '%${searchWord}%' OR c2.CategoryName LIKE '%${searchWord}%'
        GROUP BY
          l.LectureID, l.LectureImageURL, l.LectureTitle, l.LecturePrice
        ORDER BY
          AverageRating DESC;
      `;
  
      conn.query(query, (error, results) => {
        console.log("results:",results);
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