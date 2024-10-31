import React, { Component } from "react";
import { createHash } from 'crypto';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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

const hashPassword = (password: string): string => {
  const hash = createHash('sha256').update(password + 'YOUR_FIXED_SALT').digest('hex');
  return hash;
};

export { formatDate, formatPrice, hashPassword };

