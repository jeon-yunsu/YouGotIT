const mariadb = require('mariadb');
const dbconfig = require('../config/dbconfig.json');

// 데이터베이스 연결 정보 설정
const pool = mariadb.createPool({
    host: dbconfig.host, 
    user: dbconfig.user, 
    port: dbconfig.port,
    password: dbconfig.password, 
    database: dbconfig.database 
});

async function queryDatabase() {
    let conn;
    try {
        // 데이터베이스 연결
        conn = await pool.getConnection();

        // 쿼리 실행 및 결과 조회
        const rows = await conn.query('SELECT * FROM user');
        
        // 결과 출력
        console.log(rows);
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        // 연결 반환
        if (conn) conn.release();
    }
}

// 함수 실행
queryDatabase();
