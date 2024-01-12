// 모듈
const express = require('express'); 
const bodyParser = require('body-parser'); 
const session = require('express-session');
const path = require('path');
const app = express();

const home = require('./routes/index');
const auth = require('./routes/auth');
const categories = require('./routes/categories');
const search = require('./routes/search');
const userInfo = require('./routes/userInfo');
const cart = require('./routes/cart');
const payment = require('./routes/payment');
const lecture = require('./routes/lecture');

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
app.use('/api/auth', auth);
app.use('/api/categories', categories);
app.use('/api/search-list', search);
app.use('/api/userInfo', userInfo);
app.use('/api/cart', cart);
app.use('/api/modify', payment);
app.use('/api/lecture', lecture);


app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });
