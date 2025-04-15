import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://un-aux.onrender.com",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
