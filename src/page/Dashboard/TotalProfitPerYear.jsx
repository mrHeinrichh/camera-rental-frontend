import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useGetTransactionsQuery } from "@/state/api/reducer";

export default function () {
  const { data, isLoading } = useGetTransactionsQuery({ query: "" });

  if (isLoading) return <div>Loading...</div>;

  const transactionsWithTotalSales =
    data?.details?.map((transaction) => {
      const totalSales = transaction.cameras.reduce((acc, camera) => {
        return acc + camera.price;
      }, 0);
      return { ...transaction, totalSales };
    }) || [];

  const groupedData = transactionsWithTotalSales.reduce((acc, transaction) => {
    const year = new Date(transaction.date).getFullYear();
    const sales = transaction.totalSales || 0;

    acc[year] = (acc[year] || 0) + sales;
    return acc;
  }, {});

  const chartData = Object.entries(groupedData).map(([year, sales]) => ({
    year,
    sales,
  }));

  if (!data || !data.success || groupedData.length === 0) return null;

  return (
    <LineChart
      width={600}
      height={400}
      data={chartData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip formatter={(value, name) => ["$" + value, "Total Sales"]} />
      <Line
        type="monotone"
        dataKey="sales"
        stroke="#8884d8"
        strokeWidth={2}
        dot={{ strokeWidth: 0 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}
