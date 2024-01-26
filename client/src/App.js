import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';

import SignUp from "./pages/auth/signUp/SignUp" //회원가입
import SignIn from "./pages/auth/signIn/SignIn" //로그인

import Home from "./pages/home/Home" //메인

import Search from "./pages/search/Search" //검색

import Profile from "./pages/mypage/profile/profile" //프로필

import Cart from "./pages/mypage/cart/Cart"; //장바구니
import Payment from "./pages/mypage/payment/Payment" //결제내역
import Mypage from "./pages/mypage/Mypage"; //마이페이지
import Lecture from "./pages/lecture/Lecture";
import WatchLecture from "./pages/watchLecture/WatchLecture";
import ProfileUpdate from "./pages/mypage/profile/profileUpdate/ProfileUpdate";
import MyCourse from "./pages/mypage/mycourse/MyCourse";
import Header from "../src/components/Header/Header"
import Footer from "../src/components/Footer/Footer"
import LectureList from "./pages/category/LectureList";

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
        path: "/watchLecture/:lectureID",
        element: <WatchLecture />
      },

      {
        path: "/mycourse",
        element: <MyCourse />
      },
     
      {
        path: "/lecture/:lectureID",
        element: <Lecture />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/lectureList",
        element: <LectureList />
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
        path: "/profileupdate",
        element: <ProfileUpdate />
      },
     
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/payment",
        element: <Payment />
      },
      {
        path: "/signUp",
        element: <SignUp />
      },
    ]
  },
  // {
  //   path: "/signUp",
  //   element: <SignUp />
  // },
  // {
  //   path: "/signIn",
  //   element: <SignIn />
  // },


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
