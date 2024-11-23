import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  hAxis: {
    title: 'Tháng',
  },
  vAxis: {
    title: 'Số lượng khách hàng',
  },
};

interface CustomerLineChart {
  data: any[]
}

export default function CustomerLineChart({ data }: CustomerLineChart) {
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
}
