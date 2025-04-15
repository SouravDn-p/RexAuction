import axios from "axios";

// Create a secure Axios instance with credentials enabled
export const axiosSecure = axios.create({
  baseURL: "https://un-aux.onrender.com",
  withCredentials: true, // Ensure cookies are sent with requests
});

const useAxiosSecure = () => {
  // useEffect(() => {
  //   if (!navigate) return; // Ensure navigate is only used when Router is available

  //   // Response interceptor to handle authentication errors
  //   const responseInterceptor = axiosSecure.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       const status = error.response?.status;

  //       if (status === 403) {
  //         console.warn("Forbidden request - Logging out user");
  //         await logout(); // Logout user
  //         navigate("/login"); // Redirect to login
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   // Cleanup interceptor when component unmounts
  //   return () => {
  //     axiosSecure.interceptors.response.eject(responseInterceptor);
  //   };
  // }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
