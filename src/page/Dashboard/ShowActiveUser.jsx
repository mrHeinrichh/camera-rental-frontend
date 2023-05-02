import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useGetUsersQuery } from "@/state/api/reducer";
import { PacmanLoader } from "react-spinners";
import randomColor from "randomcolor";
import { ERROR } from "../../constants";

export default function () {
  const { data, isLoading, isError } = useGetUsersQuery();

  const chartData = React.useMemo(() => {
    if (!isLoading && !isError && data?.details) {
      const activeCount = data?.details?.filter((user) => user.active).length;
      const inactiveCount = data?.details?.length - activeCount;
      return [
        { name: "Active", quantity: activeCount },
        { name: "Inactive", quantity: inactiveCount },
      ];
    }
    return [];
  }, [data, isLoading, isError]);

  const COLORS = React.useMemo(() => {
    if (chartData.length === 0) return [];
    return randomColor({ count: chartData.length, luminosity: "bright" });
  }, [chartData]);

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
      ) : (
        <PieChart width={800} height={400}>
          <Pie
            data={chartData}
            dataKey="quantity"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </>
  );
}
