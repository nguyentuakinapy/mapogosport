import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Popup = ({ voucher }: { voucher: Voucher }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Kiểm tra nếu đang chạy trên client-side
      const userSession = sessionStorage.getItem('user');
      setUser(userSession ? JSON.parse(userSession) : null);

    }
  }, []);

  // check activeDate = realtime
  useEffect(() => {
    const checkActiveDate = () => {
      const now = new Date().getTime(); // realtime
      const activeTime = new Date(voucher.activeDate).getTime(); // start time use voucher

      if (now >= activeTime) {
        setIsActive(true); // show popup if actived
      }
    };

    checkActiveDate();
  }, [voucher.activeDate]);

  // time remaining for activeDate
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(voucher.endDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // format time (hh:mm:ss)
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        setTimeLeft(formattedTime);
        // save localStorage
        localStorage.setItem("timeLeft", formattedTime);
      } else {
        setIsActive(false); // hiden popup if unactive
        setTimeLeft("00:00:00"); // reset time
        localStorage.removeItem("timeLeft"); // Delete from localStorage
      }
    };

    const savedTimeLeft = localStorage.getItem("timeLeft");
    if (savedTimeLeft) {
      setTimeLeft(savedTimeLeft); // get time from localStorage
    } else {
      // if time is not available from localStorage, caculate from endDate
      calculateTimeLeft();
    }

    const intervalId = setInterval(calculateTimeLeft, 1000); // update each second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [voucher.endDate]); // reset if voucher.endDate change

  // close popup
  const closePopup = () => {
    setIsActive(false);
  };

  if (!isActive) return null;

  // resolve to get voucher

  const handelSubmitGetVoucher = async (voucherId: number) => {
    if (!user || !user.username) {
        toast.warning("Bạn chưa đăng nhập!");
        return;
    }

    const UserVoucher = {
        user: {
            username: user.username, 
        },
        voucher: {
            voucherId: voucherId 
        },
        status: 'Đang còn hạn',
        date: new Date(),
    };

    console.log("Dữ liệu User Voucher:", UserVoucher); // Đầu ra để kiểm tra

    try {
        const response = await fetch('http://localhost:8080/rest/userVoucher/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UserVoucher),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Có lỗi xảy ra khi nhận voucher: ${errorMessage}`);
        }

        const result = await response.json();
        toast.success("Nhận Voucher giá thành công!");
    } catch (error) {
        console.error("Lỗi khi nhận Voucher:", error);
        alert("Có lỗi xảy ra khi nhận Voucher. Vui lòng thử lại sau.");
    }
};



  return (
    <div className="popup-overlay">
      <div className="popup">
        <span className="close" id="closePopup" onClick={closePopup}>
          &times;
        </span>
        <h2>FLASH SALE</h2>
        <div className="percent">{voucher.discountPercent}% OFF</div>
        <p>Nhanh tay đặt sân và mua sắm ngay!</p>
        <button className="claim-btn" onClick={() => {
          handelSubmitGetVoucher(voucher.voucherId)
        }
        }>Nhận Voucher</button>

        <div className="countdown">{timeLeft}</div>
      </div>
    </div>
  );
};

export default Popup;
