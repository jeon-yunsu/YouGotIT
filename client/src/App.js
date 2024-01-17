import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';

import SignUp from "./pages/auth/signUp/SignUp" //회원가입
import SignIn from "./pages/auth/signIn/SignIn" //로그인
import Write from "./pages/Write"
import Home from "./pages/home/Home" //메인
import Single from "./pages/Single"
import Search from "./pages/search/Search" //검색
import Courses from "./pages/Courses"
import OnlineStudy from "./pages/OnlineStudy"
import Profile from "./pages/mypage/profile/profile" //프로필
import MyOnline from "./pages/MyOnline"
import Cart from "./pages/mypage/cart/Cart"; //장바구니
import Payment from "./pages/mypage/payment/Payment" //결제내역
import Mypage from "./pages/mypage/Mypage"; //마이페이지
import Lecture from "./pages/lecture/Lecture";
import WatchLecture from "./pages/watchLecture/WatchLecture";

import Header from "../src/components/Header/Header"
import Footer from "../src/components/Footer/Footer"

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/post/:id",
        element: <Single />
      },
      {
        path: "/watchLecture",
        element: <WatchLecture />
      },
      {
        path: "/write",
        element: <Write />
      },
      {
        path: "/lecture",
        element: <Lecture />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/courses",
        element: <Courses />
      },
      {
        path: "/mypage",
        element: <Mypage />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/myonline",
        element: <MyOnline />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/payment",
        element: <Payment />
      },
    ]
  },
  {
    path: "/signUp",
    element: <SignUp />
  },
  {
    path: "/signIn",
    element: <SignIn />
  },
  {
    path: "/onlinestudy",
    element: <OnlineStudy />
  },

]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
