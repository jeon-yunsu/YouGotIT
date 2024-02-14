// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const qs = require("qs");
const axios = require("axios");

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const categoriesRoutes = require("./routes/categories");
const searchRoutes = require("./routes/search");
const userInfoRoutes = require("./routes/userInfo");
const cartRoutes = require("./routes/cart");
const paymentRoutes = require("./routes/payment");
const lectureRoutes = require("./routes/lecture");
const enrollmentRoutes = require("./routes/enrollment");
const fileRoutes =  require('./img_server/fileUpload');
const mailRoutes = require('./routes/mail');

// 미들웨어 등록
const corsOptions = {
  origin: ["http://localhost:3000", "https://accounts.kakao.com", "http://localhost:4000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "public")));

app.use(express.static('public'));

app.use('/images/:imageName', function(req, res){
  var imgName = req.params.imageName;
  console.log('이미지 요청: ' + imgName);
  res.sendFile(path.join(__dirname, 'public', imgName));
});

// 라우터 등록
app.use("/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/search-list", searchRoutes);
app.use("/api/userInfo", userInfoRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/modify", paymentRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/file", fileRoutes)
app.use("/api/mail", mailRoutes);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
