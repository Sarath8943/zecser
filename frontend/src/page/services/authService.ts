// authService.ts
import axios from "axios"
import ApiPath from "../shared/ApiPath"

interface RegisterResponse {
  message: string;
  success: boolean;
  userId?: string;
}

export const registerUser = (data: any) =>
  axios.post<RegisterResponse>(`${ApiPath}/api/user/sign`, data,{
    headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
  });
