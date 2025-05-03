// hooks/useAxiosPublic.jsx
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://rex-auction-server-side-jzyx.onrender.com",
  // https://rex-auction-server-side-jzyx.onrender.com/
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
