// hooks/useAxiosPublic.jsx
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // http://localhost:5001/
});
// http://localhost:5001/ https://rex-auction-server-side-jzyx.onrender.com
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
