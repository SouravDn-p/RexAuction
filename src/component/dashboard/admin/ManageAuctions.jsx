import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

export default function ManageAuctions() {
  const axiosSecure = useAxiosSecure();
  const {data, isLoading, error} = useQuery({
    queryKey: ["auctionData"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/auctions`);
      return res.data || [];
    },
  });

  console.log(data)
  return (
    <div>
      <h1>ManageAuctions</h1>
    </div>
  );
}
