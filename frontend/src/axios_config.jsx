import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.67:52912",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
