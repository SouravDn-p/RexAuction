import { Navigate, useLocation } from "react-router-dom";
import useSeller from "../hooks/useSeller";
import LoadingSpinner from "../component/LoadingSpinner";
import useAuth from "../hooks/useAuth";


const SellerRoute = () => {
    const { user, loading } = useAuth();
    const [isSeller, isSellerLoading] =useSeller();
    const location = useLocation();
    if (loading || isSellerLoading) {
        return <LoadingSpinner />;
      }
    
      if (user && isSeller) {
        return children;
      }
    console.log({user})
      return <Navigate to="/" state={{ from: location }} replace />;
};

export default SellerRoute;