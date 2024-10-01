import React from 'react';
import CustomerLineChart from './CustomerLineChart';
import CustomerTrendChart from './CustomerTrendChart';



export default function CustomerChartPage() {
  return (
    <div className="container">
      <h4>Thống kê khách hàng</h4>
      <CustomerLineChart />

      <h4>Biểu đồ xu hướng khách hàng</h4>
      <CustomerTrendChart />
    </div>
  );
}
