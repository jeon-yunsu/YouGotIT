function extractEmailsFromText(text) {
  // 이메일 주소를 추출하기 위한 정규 표현식
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  
  // 문자열에서 이메일 패턴을 찾아내어 배열로 반환합니다.
  const emails = text.match(emailPattern);
  
  return emails || []; // 이메일이 발견되지 않은 경우 빈 배열을 반환합니다.
}

module.exports = extractEmailsFromText;
