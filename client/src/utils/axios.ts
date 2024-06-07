import { BASE_URL } from "@/config";
import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});
