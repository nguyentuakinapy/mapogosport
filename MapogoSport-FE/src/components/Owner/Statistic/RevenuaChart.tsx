import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Biểu đồ doanh thu theo sân bóng",
  is3D: true,
};

const data = null;

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
