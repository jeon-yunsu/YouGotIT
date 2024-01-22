// 모듈
const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const userInfoRoutes = require('./routes/userInfo');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const lectureRoutes = require('./routes/lecture');

// 미들웨어 등록
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
  
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
