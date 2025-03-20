
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin = false, isLoading: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user?.email}`);
      return res.data?.admin;
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
