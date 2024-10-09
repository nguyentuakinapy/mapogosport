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
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export { formatDate, formatPrice };
