const express = require("express");
const mysql = require("../database/mysql");
const router = express.Router();
const bodyParser = require("body-parser");
const multer = require("multer");
const verifyTokenAndGetUserId = require("../middleware/verifyTokenAndGetUserId");
const path = require("path");  // 이 줄 추가

router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImage/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/fileupload", upload.single("profileImage"), async (req, res) => {
  try {
    const userId = verifyTokenAndGetUserId(req, res);
    const imageName = 'http://localhost:4000/profileImage/'+req.file.filename;
    
    console.log("imageUrl", imageName);
    
    const updateImageQuery = `
        UPDATE 
            Users 
        SET 
            Profileimage = ? 
        WHERE 
            UserID = ?;
    `;

    mysql.query(updateImageQuery, [imageName, userId], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          status: "error",
          message: "프로필 이미지 업데이트 중 오류 발생",
          error: error.message,
        });
        return;
      }

      console.log("프로필 이미지 업데이트 성공");

      // 클라이언트에게 이미지 URL을 응답으로 보냅니다.
      res.status(200).json({
        status: "success",
        message: "프로필 이미지 업데이트 성공",
        imageUrl: imageName
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "내부 서버 오류",
    });
  }
});

module.exports = router;
