'use client';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Đảm bảo đã cài đặt Bootstrap Icons

export default function ChatBox() {
  const [showChat, setShowChat] = useState(false); // quản lý việc hiển thị chat form
  const [isMinimized, setIsMinimized] = useState(false); // quản lý trạng thái thu nhỏ của chat form
  const [isMaximized, setIsMaximized] = useState(false); // quản lý trạng thái phóng to của chat form

  const handleChatToggle = () => {
    setShowChat(!showChat); //nếu true thì thực hiện mở form chat
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized); // nếu true thì thực hiện thu nhỏ
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized); // nếu true thì thực hiện phóng to
  };

  const [messages, setMessages] = useState([
    { sender: 'bot', content: 'Xin chào! Tôi có thể giúp gì cho bạn?' },
    { sender: 'user', content: 'Tôi cần thông tin về dịch vụ của bạn.' },
    { sender: 'bot', content: 'Chúng tôi cung cấp nhiều dịch vụ như tư vấn, hỗ trợ khách hàng...' },
  ]);

  const [inputMessage, setInputMessage] = useState(''); // lưu trữ nội dung người dùng đang nhập vào ô chat

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { sender: 'user', content: inputMessage }]);  // Operator thread dùng để copy mảng cũ
      setInputMessage('');  // set nội dung sau khi nhập xong
    }
  };

  return (
    <>
    <div className='py-5'>
      {/* Messenger Icon */}
      <div 
        className="position-fixed  rounded-circle"  
        style={{
          bottom: '20px',
          right: '20px',
          zIndex: '1000',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', // Tùy chỉnh box shadow

        }} 
        onClick={handleChatToggle} // Khi click vào icon sẽ mở form chat nhấn vào sẽ thành TRUE
      >
        <img 
          src="/images/messenger logo.png" 
          alt="Messenger" 
          style={{ width: '60px', cursor: 'pointer' }} 
        />
      </div>

      {/* Chat Box sẽ chỉ hiển thị khi showChat là true */}
      <div> 
      {showChat && (  // cú pháp điều kiện nếu vế trái trả về TRUE sẽ thực hiện việc render JSX
        <div className="card position-fixed " 
          style={{
            bottom: '10px', // Điều chỉnh khoảng cách từ đáy màn hình
            right: '90px',
            width: isMaximized ? '500px' : '340px', 
            height: isMinimized ? '50px' : '500px', // auto
          }}
        >
          <div className="card-header d-flex align-items-center bg-light">
            <img
              src="/images/logo.png"
              alt="Chat Logo"
              className="me-2"
              style={{ width: '30px' }}
            />
            <h6 className="mb-0">Khám phá thêm</h6>
            <div className="ms-auto">
              <Button 
                variant="link"
                onClick={handleMinimizeToggle} 
                title={isMinimized ? "Phóng to" : "Thu nhỏ"}
                className="p-0"
              >
                <i className={`h6 bi ${isMinimized ? 'bi-arrows-angle-expand' : 'bi-dash-lg'}`}></i>
              </Button>
              <Button 
                variant="link"
                onClick={handleMaximizeToggle} 
                title={isMaximized ? "Thu nhỏ" : "Phóng to"}
                className="p-0 mx-2"
              >
                <i className={` h6 bi ${isMaximized ? 'bi-arrows-angle-contract' : 'bi-arrows-fullscreen'}`}></i>
              </Button>
              <Button 
                variant="link"
                onClick={handleChatToggle}
                className="p-0 text-priamry text-decoration-none "
              >
                <h5 className='mt-2'>X</h5>
              </Button>
            </div>
          </div>

          {/* Phần hiển thị tin nhắn nếu không bị thu nhỏ */}
          {!isMinimized && (
            <>
              <div className="card-body overflow-auto" style={{ height: '200px' }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      className={`p-2 rounded mb-2 ${
                        msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'
                      }`}
                      style={{ maxWidth: '80%' }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Phần nhập liệu và nút gửi */}
              <div className="card-footer d-flex p-2">  {/*Form.Control tương tự như thẻ input */}
                 <Form.Control
                  type="text"
                  placeholder="Nhập câu hỏi tiếp theo của bạn"  
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="me-2"
                />
                <Button variant="warning" className="d-flex align-items-center justify-content-center" onClick={handleSendMessage}>
                  <i className="bi bi-send-fill"></i>
                </Button>
              </div>
            </>
          )}
        </div>
      )}
        </div>
    </div>
    </>
  );
}
