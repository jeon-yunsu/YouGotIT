// import axios from "axios";
// import { baseUrl } from "../config/baseUrl.js";
// import jsCookie from "js-cookie";

// export const HomeUserInfo = async () => {
//   try {
//     const token = jsCookie.get("userToken");
//     const response = await axios.get(`${baseUrl}/api/userInfo/home`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("response.data123: "+response.data.UserEmail);
//     return response.data;
//   } catch (error) {
//     console.error('유저 정보 가져오기 중 오류:', error);
//     throw error;
//   }
// };
