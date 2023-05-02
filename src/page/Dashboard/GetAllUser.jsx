import React from "react";
import ListData from "../../component/ListData";
import { AccountCircle } from "@mui/icons-material";
import { useGetUsersQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];
  const usersCount = users.length;

  return isLoading ? (
    <div className="loader">
      <PacmanLoader color="#2c3e50" loading={true} size={50} />
    </div>
  ) : (
    <ListData
      title="Users"
      data={usersCount}
      icon={<AccountCircle sx={{ fontSize: "8rem", color: "blue" }} />}
    />
  );
}
