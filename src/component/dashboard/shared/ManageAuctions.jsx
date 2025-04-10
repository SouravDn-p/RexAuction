import useAuth from "../../../hooks/useAuth";
import ManageCard from "./ManageCard";
import SdManageTable from "./SdManageTable";

function ManageAuctions() {
  const { dbUser } = useAuth();
  return (
    <div>
      {/* {dbUser.role === "admin" && <ManageTable />} */}
      {dbUser.role === "admin" && <SdManageTable />}
      {dbUser.role === "seller" && <ManageCard />}
    </div>
  );
}

export default ManageAuctions;
