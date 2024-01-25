import axios from "axios";
import { createContext, useEffect, useState } from "react";
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

    const logout = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
            // console.log(response.data); // 서버에서 보내는 응답 확인
          } catch (error) {
            console.error('로그아웃 중 오류:', error);
          }
        setCurrentUser(null);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
