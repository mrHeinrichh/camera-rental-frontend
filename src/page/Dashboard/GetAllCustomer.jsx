import React from "react";
import ListData from "../../component/ListData";
import { Person } from "@mui/icons-material";
import { useGetUsersQuery } from "@/state/api/reducer";
import { USER } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];
  const customers = users.filter((user) => user.roles.includes(USER.CUSTOMER));
  const customerCount = customers.length;

  return isLoading ? (
    <div className="loader">
      <PacmanLoader color="#2c3e50" loading={true} size={50} />
    </div>
  ) : (
    <ListData
      title="Customer"
      data={customerCount}
      icon={<Person sx={{ fontSize: "8rem", color: "yellow" }} />}
    />
  );
}
