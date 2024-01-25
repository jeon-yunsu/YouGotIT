const jwt = require("jsonwebtoken");

const verifyTokenAndGetUserId = (req, res) => {
    const key = process.env.JWT_SECRET;
  
    // 토큰 해독
    const authHeader = req.headers["authorization"];
    // console.log("authHeader:", authHeader);
  
    const token = authHeader && authHeader.split(" ")[1];
    // console.log("token:", token);
    if (!token) {
      console.error("Token not provided");
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Token not provided",
      });
    }
  
    let userId;
  
    try {
      // JWT 토큰을 해독하여 사용자 ID를 추출
      const decodedToken = jwt.verify(token, key);
      // console.log("decodedToken:", decodedToken);
      userId = decodedToken.userID;
      // console.log("userId:", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }
  
    return userId;
  };
  
  module.exports = verifyTokenAndGetUserId;
  