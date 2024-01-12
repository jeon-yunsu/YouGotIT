// 모듈
const express = require('express'); 
const bodyParser = require('body-parser'); 
const home = require('./routes/index');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();

// 미들웨어 등록
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'sddasd123',
    resave: false,
    saveUninitialized: true
}));



// 템플릿 엔진 설정
app.set('views','./views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
// 라우터 등록
app.use('/', home);

app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });
