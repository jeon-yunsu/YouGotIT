const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId");

//장바구니 담기 (강의)
router.post("/add-lecture", async (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.body.LectureID;
  // console.log(userId)

  mysql.getConnection((error, conn) => {
    if (error) {
      res.status(500).send("Internal Server Error");
      return;
    }

    conn.query(
      "INSERT INTO Cart (UserID, LectureID, CreateDate) VALUES (?, ?, NOW());",
      [userId, lectureId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send("Cart added successfully");
        }

        // 쿼리 완료 후 연결 해제
        conn.release();
      }
    );
  });
});

//장바구니 출력(강의)
router.get("/cartlist-lecture", (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  console.log(userId);

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

//장바구니 삭제(강의)
router.post("/delete-lecture", async (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.body.lectureId;

  console.log("lectureId12", lectureId);
  console.log("userId12", userId);

  mysql.getConnection((error, conn) => {
    if (error) {
      res.status(500).send("내부 서버 오류");
      return;
    }

    conn.query(
      "DELETE FROM Cart WHERE LectureID = ? AND UserID = ?;",
      [lectureId, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("내부 서버 오류");
        } else {
          res.status(200).send("삭제 성공");
        }

        // 쿼리 완료 후 연결 해제
        conn.release();
      }
    );
  });
});

// 해당 강의가 장바구니에 담겨있는지 확인
router.get("/cartlist/check/lecture", (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.query.lectureId; // 변경: req.body.LectureID → req.query.lectureId

  console.log(userId);

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
        c.UserID ,
        c.LectureID 
      FROM
        Cart c 
      WHERE 
        c.UserID = ? AND c.LectureID =?
    `;

    conn.query(query, [userId, lectureId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        // 결과가 빈 배열인지 확인하여 true 또는 false 반환
        const isInCart = results.length > 0;
        res.json(isInCart);
        console.log(isInCart);
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

// -------------------------------------------

//장바구니 담기 (상품)
router.post("/add-product", async (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const productId = req.body.productId;
  const quantity = req.body.Quantity;
  console.log("productId", productId);
  // console.log(userId)

  mysql.getConnection((error, conn) => {
    if (error) {
      res.status(500).send("Internal Server Error");
      return;
    }

    conn.query(
      "INSERT INTO ProductCart (UserID, ProductID, CreateDate, Quantity) VALUES (?, ?, NOW(), ?);",
      [userId, productId, quantity],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.status(200).send("Cart added successfully");
        }

        // 쿼리 완료 후 연결 해제
        conn.release();
      }
    );
  });
});

//장바구니 출력 (강의)
router.get("/cartlist-product", (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  console.log(userId);

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
        p.ProductImage ,
        p.ProductID ,
        p.ProductName ,
        p.ProductPrice ,
        pc.CreateDate ,
        pc.Quantity 
      from  
        ProductCart pc 
      JOIN
        Product p ON p.ProductID = pc.ProductID 
      JOIN
        Users u ON u.UserID = pc.UserID 
      WHERE 
              u.UserID = '${userId}'
      ORDER BY pc.CreateDate desc;
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

//장바구니 삭제()
router.post("/delete-product", async (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const productId = req.body.productId;

  console.log("productId11222121211", productId);

  mysql.getConnection((error, conn) => {
    if (error) {
      res.status(500).send("내부 서버 오류");
      return;
    }

    conn.query(
      "DELETE FROM ProductCart WHERE ProductID = ? AND UserID = ?;",
      [productId, userId],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("내부 서버 오류");
        } else {
          res.status(200).send("삭제 성공");
        }

        // 쿼리 완료 후 연결 해제
        conn.release();
      }
    );
  });
});

// 해당 상품이 장바구니에 담겨있는지 확인
router.get("/cartlist/check/product", (req, res) => {
  const userId = verifyTokenAndGetUserId(req, res);
  const lectureId = req.query.lectureId; // 변경: req.body.LectureID → req.query.lectureId

  console.log(userId);

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
        c.UserID ,
        c.LectureID 
      FROM
        Cart c 
      WHERE 
        c.UserID = ? AND c.LectureID =?
    `;

    conn.query(query, [userId, lectureId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        // 결과가 빈 배열인지 확인하여 true 또는 false 반환
        const isInCart = results.length > 0;
        res.json(isInCart);
        console.log(isInCart);
      }

      // MySQL 연결 종료
      conn.release();
    });
  });
});

module.exports = router;
