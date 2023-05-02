import React from "react";
import ListData from "../../component/ListData";
import { LockPersonRounded } from "@mui/icons-material";
import { useGetUsersQuery } from "@/state/api/reducer";
import { USER } from "@/constants";
import { PacmanLoader } from "react-spinners";

export default function () {
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];
  const admins = users.filter((user) => user.roles.includes(USER.ADMIN));
  const adminCount = admins.length;

  return isLoading ? (
    <div className="loader">
      <PacmanLoader color="#2c3e50" loading={true} size={50} />
    </div>
  ) : (
    <ListData
      title="Admin"
      data={adminCount}
      icon={<LockPersonRounded sx={{ fontSize: "8rem", color: "red" }} />}
    />
  );
}
