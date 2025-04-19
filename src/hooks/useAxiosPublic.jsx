import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});
// https://rex-auction-server-side-jzyx.onrender.com
// http://localhost:5000
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
