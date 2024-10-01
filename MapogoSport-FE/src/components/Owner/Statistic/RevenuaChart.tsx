import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Biểu đồ doanh thu theo sân bóng",
  is3D: true,
};

const data = [
  ["Sân bóng", "Doanh thu"],
  ["Sân 5", 11],
  ["Sân 7", 2],
  ["Sân 9", 2],
  ["Sân 11", 2],
];

export default function RevenueChart() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"500px"}
    />
  );
}
