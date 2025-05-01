import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useAnnouncement = () => {
  const axiosPublic = useAxiosPublic();
  const {
    refetch,
    data: announcements = [],
    isLoading,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/announcement`);

      return res.data;
    },
  });

  return [announcements, refetch, isLoading];
};

export default useAnnouncement;
