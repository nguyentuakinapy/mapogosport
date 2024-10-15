import React, { Component } from "react";
import { createHash } from 'crypto';

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

const hashPassword = (password: string): string => {
  const hash = createHash('sha256').update(password + 'YOUR_FIXED_SALT').digest('hex');
  return hash;
};

export { formatDate, formatPrice, hashPassword };
