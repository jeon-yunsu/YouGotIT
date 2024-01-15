// 모듈
const express = require('express'); 
const bodyParser = require('body-parser'); 
const session = require('express-session');
const path = require('path');
const app = express();
const cors = require('cors');

const homeRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const userInfoRoutes = require('./routes/userInfo');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const lectureRoutes = require('./routes/lecture');

// 미들웨어 등록
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'sddasd123',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// 라우터 등록
app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/search-list', searchRoutes);
app.use('/api/userInfo', userInfoRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/modify', paymentRoutes);
app.use('/api/lecture', lectureRoutes);


app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });
