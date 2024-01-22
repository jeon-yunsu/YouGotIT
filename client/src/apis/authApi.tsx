import React from "react";
import axios from "axios";
import { baseUrl } from "../config/baseUrl.js";

export const signIn = async (username, password) => {
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

    return response.data;
  } catch (error) {
    throw error;
  }
};
