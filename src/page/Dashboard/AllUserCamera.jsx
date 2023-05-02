import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Cell,
} from "recharts";
import { Typography, Box } from "@mui/material";
import { groupBy } from "lodash";
import { useGetCamerasQuery } from "@/state/api/reducer";
import randomColor from "randomcolor";

export default function AllFarmerCameras() {
  const { data, isLoading } = useGetCamerasQuery();

  const groupedData = React.useMemo(() => {
    if (!data) return [];
    const grouped = groupBy(data?.details, (value) => value.user.name);
    const result = Object.keys(grouped).map((name, index) => {
      const userCameras = grouped[name];
      const cameraNames = userCameras.map((camera) => camera.name);
      return {
        name,
        cameras: cameraNames,
        totalCameras: userCameras.filter((camera) => camera.status !== 1)
          .length,
        color: randomColor({ luminosity: "bright" }),
      };
    });
    return result;
  }, [data]);

  const maxCameras = React.useMemo(() => {
    if (groupedData.length === 0) return 0;
    return Math.max(...groupedData.map((item) => item.totalCameras));
  }, [groupedData]);

  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const cameras = payload[0].payload.cameras.join(", ");
      return (
        <Box sx={{ backgroundColor: "white" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              paddingTop: ".25rem",
              paddingX: ".5rem",
            }}
          >{`User: ${label} has ${payload[0].value} camera(s)`}</Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", padding: "0 2rem", textAlign: "center" }}
          >{`Camera: ${cameras}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) return <div>Loading...</div>;

  if (!data || !data.success || groupedData.length === 0) return null;

  return (
    <BarChart
      width={600}
      height={400}
      data={groupedData}
      margin={{ top: 20, right: 30 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, maxCameras]} />
      <Tooltip content={renderCustomTooltip} />
      <Bar dataKey="totalCameras" fill="#8884d8">
        {groupedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  );
}
