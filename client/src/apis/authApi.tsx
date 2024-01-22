import React from "react";
import axios from "axios";
import { baseApiUrl } from "../config/api";


export const signInApi = async(data: any) => {

    
  const response = await axios.post(`${baseApiUrl}/api/auth/signIn`, data).catch((error)=> null);
  if (!response) return null;

  const result = response.data;
  console.log(result);
  return result;
}

export const signUpApi = async (data: any) => {

    
  const response = await axios.post(`${baseApiUrl}/api/auth/signUp`, data).catch((error)=> null);

  if (!response) return null;

  const result = response.data.result;

  return result;

}

export const findEmail = async(data: any) => {

  const response = await axios.post(`${baseApiUrl}/api/userInfo/find-email`, data).catch((error)=> null);
  if (!response) return null;

  const result = response.data;
  return result;
}



