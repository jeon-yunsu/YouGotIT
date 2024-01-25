import React from "react";
import axios from "axios";
import { baseUrl } from "../config/baseUrl.js";
import jsCookie from "js-cookie";

export const MainAPI = async () => {
  try {
    const token = jsCookie.get("userToken");
    const response = await axios.get(`${baseUrl}/`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response && response.data) {
        console.log("Server Data:", response.data); // 추가한 부분
        return response.data;
    } else {
    console.error("Invalid response format:", response);
    return null;
    }
  } catch (error) {
    console.error("error:", error);
  }
};
  