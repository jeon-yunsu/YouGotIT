const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

//스토어 메인 화면에서 전체 상품 가져오기
router.get("/", (req, res) => {
  // 페이지 번호와 한 페이지당 아이템 수를 쿼리 매개변수로 받아옴
  const { page, perPage } = req.query;

  console.log(page, perPage);

  // MySQL 연결
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
      return;
    }

    // SQL 쿼리 실행
    const offset = (parseInt(page) - 1) * parseInt(perPage);
    const limit = parseInt(perPage);
    // 반환할 행의 수
    console.log("offset", offset, "limit", limit);
    const getProductQuery = `
        SELECT 
            * 
        FROM 
            Product p 
        ORDER BY PurchaseCount DESC
        LIMIT ?, ?;`;

    conn.query(
      getProductQuery,
      [offset, limit], // 오프셋과 반환할 행의 수를 쿼리에 전달
      (error, product) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            status: "error",
            message: "상품 정보를 가져오는 중 에러 발생",
            error: error.message,
          });
          return;
        }
        res.status(200).json({
          status: "success",
          data: product,
        });
      }
    );
  });
});

//상품 디테일 페이지
router.get("/products/:productId", (req, res) => {
  const productId = req.params.productId;
  console.log("productId", productId);
  mysql.getConnection((error, conn) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
      return;
    }

    // SQL 쿼리 실행
    const getProductQuery = `
        SELECT 
            * 
        From 
            Product p 
        WHERE
            p.ProductID = ${productId}
    `;

    conn.query(getProductQuery, (error, product) => {
      //   console.log(product);
      if (error) {
        console.error(error);
        res.status(500).json({
          status: "error",
          message: "상품 정보를 가져오는 중 에러 발생",
          error: error.message,
        });
        return;
      }
      res.status(200).json({
        status: "success",
        data: product,
      });
    });
  });
});

module.exports = router;
