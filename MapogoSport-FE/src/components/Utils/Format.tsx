import { createHash } from 'crypto';

const formatDate = (dateString: Date) => {
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
const formatDateNotime = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateForApi = (date: Date | null) => {
  if (!date) return '';

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - offsetMs);

  return localDate.toISOString().split('.')[0];
};




const formatPrice = (price: number) => {
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

const formatDateVN = (date: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    // weekday: 'long', // Hiển thị tên ngày trong tuần
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

const hashPassword = (password: string): string => {
  const hash = createHash('sha256').update(password + 'YOUR_FIXED_SALT').digest('hex');
  return hash;
};

export { formatDate, formatPrice, hashPassword, formatDateForApi, formatDateNotime, formatDateVN };


