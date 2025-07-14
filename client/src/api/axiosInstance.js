import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const rawToken = sessionStorage.getItem("accessToken");

      // Only parse if it's a valid JSON string (like a quoted string)
      const accessToken =
        rawToken && rawToken !== "undefined" ? JSON.parse(rawToken) : "";

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      console.warn("Token parse failed", err);
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
