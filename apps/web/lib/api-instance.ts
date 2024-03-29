import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://localhost:3001/api";
const timeout = Number(process.env.API_TIMEOUT) || 10000;

export const apiInstance = axios.create({
  baseURL,
  timeout,
  withCredentials: true,
});
