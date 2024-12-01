import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Biểu đồ doanh thu theo sân bóng",
  is3D: true,
};

type ChartHeader = [string, string, string, string, string];
type ChartRow = [string, number, string, string, number];
type ChartData = [ChartHeader, ...ChartRow[]];

interface RevenueChartProps {
  data: ChartData;
}

export default function RevenueChart({ data }: RevenueChartProps) {
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
