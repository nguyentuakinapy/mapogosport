import React, { useState, useEffect } from "react";

const Popup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    
    const hasSeenPopupSession = sessionStorage.getItem('hasSeenPopup');

    if (!hasSeenPopupSession) {
      setIsOpen(true);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }


    // Function to calculate and format time left until midnight
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Set to next midnight

      const timeDifference = midnight.getTime() - now.getTime();
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60)

      return `${hours} : ${minutes} : ${seconds}`;
    };

    // Set initial time display
    setTimeDisplay(calculateTimeLeft());

    // Update the time display every second without lag
    const timerId = setInterval(() => {
      setTimeDisplay(calculateTimeLeft());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(timerId);
  }, []);

  const handlePopupClick = () => {
    setIsOpen(false); // Close popup when the button is clicked
  };

  const closePopup = () => {
    setIsOpen(false); // Close popup when close icon is clicked
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup">
          <span className="close" id="closePopup" onClick={closePopup}>
            &times;
          </span>
          <h2>FLASH SALE</h2>
          <div className="percent">9X % OFF</div>
          <p>Nhanh tay đặt sân và mua sắm ngay!</p>
          <button
            className="claim-btn"
            onClick={() => {
              window.location.href = "/voucher";
              handlePopupClick();
            }}
          >
            Nhận Voucher ngay
          </button>

          <div className="countdown">{timeDisplay}</div>
        </div>
      </div>
    )
  );
};

export default Popup;
