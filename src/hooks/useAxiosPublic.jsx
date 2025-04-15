import axios from "axios";

const axiosPublic = axios.create({
  baseURL: " https://un-aux.onrender.com",
});
// https://un-aux.onrender.com
// http://localhost:5000
const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
