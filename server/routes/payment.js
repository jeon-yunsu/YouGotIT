const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

//결제내역
router.get("/payment", (req, res) => {
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

module.exports = router;