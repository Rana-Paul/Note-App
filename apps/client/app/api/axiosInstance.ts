import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

interface InternalAxiosRequestConfig<T> extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

// Add an interceptor to set the authorization header before each request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("note-token");

      if (token) {
        // Set the authorization header
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      if (!token) {
        return Promise.reject("No token found");
      }

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
