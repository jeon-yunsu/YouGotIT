// import React from "react";
// import axios from "axios";
// import { baseUrl } from "../config/baseUrl.js";

// export const signIn = async (username, password) => {
//   try {
//     const response = await axios.post(
//       `${baseUrl}/api/auth/signIn`,
//       {
//         UserEmail: username,
//         Password: password,
//       },
//       {
//         withCredentials: true,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const logout = async () => {
//   try {
//     const response = await axios.get(`${baseUrl}/api/auth/logout`, { withCredentials: true });
//     console.log(response.data); // 서버에서 보내는 응답 확인
//   } catch (error) {
//     console.error('로그아웃 중 오류:', error);
//   }
// };

