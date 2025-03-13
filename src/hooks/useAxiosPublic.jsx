import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosPublic = () => {
  return axiosInstance;
};

export default useAxiosPublic;
