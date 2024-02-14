const jwt = require("jsonwebtoken");
const secretObj = process.env.JWT_SECRET;

exports.VerificationToken = (req, res, next) => {
  const token = req.cookies.userToken;
  
  console.log("VerificationToken", token);
  if (!token) {
    return res.status(401).json({ success: false, message: '토큰이 없습니다.' });
  }
  try {
    // 토큰을 검증하고 디코딩
    const decoded = jwt.verify(token, secretObj);
    // 디코딩된 정보를 request 객체에 저장
    req.user = decoded;
    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    console.error('토큰 유효성 확인 오류:', error);
    return res.status(401).json({ success: false, message: '유효하지 않은 토큰입니다.' });
  }
};