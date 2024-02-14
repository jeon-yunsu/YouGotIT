import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const signIn = async (username, password) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/signIn`,
        {
          UserEmail: username,
          Password: password,
        },
        {
          withCredentials: true,
        }
      );
      setCurrentUser(response.data.userData);
    } catch (error) {
      throw error;
    }
  };

  //   const logout = async () => {
  //     // 로그아웃 로직
  //     try {
  //       await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
  //     } catch (error) {
  //       console.error("로그아웃 중 오류:", error);
  //     }
  //     setCurrentUser(null);
  //     // window.location.href = "/";
  //   };

  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
      setCurrentUser(null); // 로그아웃 후 현재 사용자를 null로 설정
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };
  

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, signIn, logout, setCurrentUser}}
    >
      {children}
    </AuthContext.Provider>
  );
};
