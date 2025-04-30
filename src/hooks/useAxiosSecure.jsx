import axios from "axios";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContexts } from "../providers/AuthProvider";

export const axiosSecure = axios.create({
  baseURL: "https://rex-auction-server-side-jzyx.onrender.com",
  withCredentials: true, // This is essential for cookie-based auth
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContexts);

  useEffect(() => {
    // Request interceptor - no need to set Authorization header for cookie-based auth
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // You might want to add other headers or request modifications here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        // If unauthorized or forbidden, logout and redirect
        if (status === 401 || status === 403) {
          try {
            await logout();
            navigate("/login", { replace: true });
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Cleanup interceptors when component unmounts
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
