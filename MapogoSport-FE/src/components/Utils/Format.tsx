import React, { Component } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatPrice = (price) => {
  // Kiểm tra nếu price không hợp lệ hoặc không phải là số
  if (typeof price !== "number" || isNaN(price)) {
    return "Giá không hợp lệ"; // Hoặc bất kỳ thông báo mặc định nào
  }

  // Định dạng giá trị nếu hợp lệ
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};


export { formatDate, formatPrice };
