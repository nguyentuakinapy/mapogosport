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

const formatTimeNoDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Đảm bảo rằng thời gian sử dụng định dạng 12 giờ (AM/PM)
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

const encodeJson = (data: object): string => {
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64');
}

const decodeJson = (encodedData: string): string => {
  const jsonString = Buffer.from(encodedData, 'base64').toString('utf-8');
  return jsonString;
}

const encodeString = (data: string): string => {
  return Buffer.from(data).toString('base64');
}

const decodeString = (encodedData: string): string => {
  return Buffer.from(encodedData, 'base64').toString('utf-8');
}

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
export {
  formatDate, formatPrice, hashPassword, encodeJson, decodeJson, encodeString, decodeString,
  formatDateForApi, formatDateNotime, formatDateVN, formatTimeNoDate,removeVietnameseTones
};


