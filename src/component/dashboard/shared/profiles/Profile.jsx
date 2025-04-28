// import useAuth from "../../../hooks/useAuth";
import useAuth from "../../../../hooks/useAuth";
import AdminProfile from "./AdminProfile";
import BuyerProfile from "./BuyerProfile";
import SellerProfile from "./SellerProfile";


function Profile() {
  const { dbUser } = useAuth();
  return (
    <div>
 
      {dbUser.role === "admin" && <AdminProfile />}
      {dbUser.role === "seller" && <SellerProfile />}
      
      {dbUser.role === "buyer" && <BuyerProfile />}
    </div>
  );
}

export default Profile;
