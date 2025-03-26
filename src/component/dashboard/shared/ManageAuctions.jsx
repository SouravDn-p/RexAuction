import useAuth from "../../../hooks/useAuth";
import ManageCard from "./ManageCard";
import ManageTable from "./manageTable";

function ManageAuctions() {
  const { dbUser } = useAuth();
  return (
    <div>
      {dbUser.role === "admin" && <ManageTable />}
      {dbUser.role === "seller" && <ManageCard />}
    </div>
  );
}

export default ManageAuctions;
