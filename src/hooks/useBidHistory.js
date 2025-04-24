import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useBidHistory = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const {
    refetch,
    data: bidHistory = [],
    isLoading,
  } = useQuery({
    queryKey: ["bidHistory", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/bid-history/${user?.email}`);
      return res.data;
    },
  });

  return [bidHistory, refetch, isLoading];
};

export default useBidHistory;
