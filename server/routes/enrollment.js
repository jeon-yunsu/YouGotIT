const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId");

// 수강 여부 확인
router.get("/checked/:lectureId", (req, res) => {
    const userId = verifyTokenAndGetUserId(req, res);
    const lectureId = req.params.lectureId;
    // console.log("lectureId", lectureId);
    // console.log("userId", userId);
    
    if (!userId) {
        res.status(400).send("헤더에서 사용자 ID를 찾을 수 없습니다.");
        return;
    }
  
    // MySQL 연결
    mysql.getConnection((error, conn) => {
        if (error) {
            console.log(error);
            res.status(500).send("내부 서버 오류");
            return;
        }

        // SQL 쿼리 실행
        const query = `
            SELECT * FROM Enrollments WHERE UserID = '${userId}' AND LectureID = '${lectureId}';
        `;
  
        conn.query(query, (error, results) => {
            // console.log("results", results);
            if (error) {
                console.error(error);
                res.status(500).send("내부 서버 오류");
            } else {
                // results가 존재하면 true, 아니면 false로 응답
                res.json(results.length > 0);
            }

            // MySQL 연결 종료
            conn.release();
        });
    });
});

// 수강하기
router.post('/', (req, res) => {
    const userId = verifyTokenAndGetUserId(req, res);
    const lectureId = req.body.lectureId;  // 수정된 부분
  
    console.log("lectureId", lectureId);
  
    if (!userId) {
      res.status(400).send("헤더에서 사용자 ID를 찾을 수 없습니다.");
      return;
    }
  
    // MySQL 연결
    mysql.getConnection((error, conn) => {
      if (error) {
        console.log(error);
        res.status(500).send("내부 서버 오류");
        return;
      }
  
      // SQL 쿼리 실행 (Prepared Statement 사용)
      const query = `
        INSERT INTO Enrollments (UserID, LectureID, EnrollmentDate, AttendanceRate, PaymentStatus)
        VALUES (?, ?, NOW(), 0, 1);
      `;
      
      conn.query(query, [userId, lectureId], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("내부 서버 오류");
        } else {
          // 클라이언트에게 적절한 응답 제공
          res.status(200).send("강의 수강 신청이 완료되었습니다.");
        }
  
        // MySQL 연결 종료
        conn.release();
      });
    });
});
  

module.exports = router;
