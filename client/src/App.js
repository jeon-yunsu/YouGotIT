import "./style.scss"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';

import SignUp from "./pages/auth/signUp/SignUp";
import SignIn from "./pages/auth/signIn/SignIn";
import Write from "./pages/Write"
import Home from "./pages/Home"
import Single from "./pages/Single"
import Search from "./pages/Search"
import Courses from "./pages/Courses"
import OnlineStudy from "./pages/OnlineStudy"
import Profile from "./pages/Profile"
import MyOnline from "./pages/MyOnline"
import Cart from "./pages/Cart"
import Payment from "./pages/Payment"

import Navbar from "../src/components/Header/Navbar"
import Footer from "../src/components/Footer/Footer"

const Layout = () => {
  return (
    <>
      <Navbar />
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
        path: "/write",
        element: <Write />
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
