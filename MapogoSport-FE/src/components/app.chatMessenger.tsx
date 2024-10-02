'use client';
import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Đảm bảo đã cài đặt Bootstrap Icons

export default function ChatBox() {
  const [showChat, setShowChat] = useState(false); // quản lý việc hiển thị chat form
  const [showChatList, setShowChatList] = useState(false); // quản lý việc hiển thị chat form
  const [showChatIcon, setShowChatIcon] = useState(true); // quản lý việc hiển thị icon chat
  const [isMinimized, setIsMinimized] = useState(false); // quản lý trạng thái thu nhỏ của chat form
  const [isMaximized, setIsMaximized] = useState(false); // quản lý trạng thái phóng to của chat form
  const [selectedChat, setSelectedChat] = useState(null); // Quản lý cuộc trò chuyện đang được chọn
  const [inputMessage, setInputMessage] = useState(''); // lưu trữ nội dung người dùng đang nhập vào ô chat

  // Giả sử danh sách các cuộc trò chuyện với nhiều người dùng
  const [chatList, setChatList] = useState([
    { id: 1, avatar: 'user-8.png', user: 'User A', messages: [{ sender: 'bot', content: 'Xin chào A!' },{ sender: 'bot', content: 'Bạn khỏe không!' }] },
    { id: 2, avatar: 'user-9.png', user: 'User B', messages: [{ sender: 'bot', content: 'Xin chào B!' }] },
    { id: 3, avatar: 'user-10.png', user: 'User C', messages: [{ sender: 'bot', content: 'Xin chào C!' }] },
  ]);
  const demo = () =>{
    return(
    
      <h1>showChatIcon: {showChatIcon.toString()}</h1>
      
    )
  }

    const [url, setUrl] = useState('');

  useEffect(() => {
    // Lấy URL từ phía client khi component đã được mount
    // setUrl(window.location.href);
    const currentPath = window.location.pathname;

     // Kiểm tra nếu đường dẫn là /chat_page thì ẩn icon chat
     if (currentPath === '/chat_page') {
      setShowChatIcon(false); // đg ở trạng hiện chat page cần ẩn
    } else {
      setShowChatIcon(true); // đg ở trang chủ cần hiện
    }
  }, []);

  // Khi bấm vào một đoạn chat trong danh sách
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChat(true); // Hiển thị form chat khi bấm vào danh sách chat
  };

  const handleChatToggle = () => {
    setShowChat(!showChat); //nếu true thì thực hiện mở form chat
  };

  const handleChatListToggle = () => {
    setShowChatList(!showChatList); //nếu true thì thực hiện mở form chat
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized); // nếu true thì thực hiện thu nhỏ
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized); // nếu true thì thực hiện phóng to
  };

const handleSendMessage = () => {
  if (inputMessage.trim() !== '') {
    if (selectedChat) {
      // Cập nhật tin nhắn cho chat đã chọn
      const updatedChatList = chatList.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, { sender: 'user', content: inputMessage }],
            }
          : chat
      );

      setChatList(updatedChatList); // Cập nhật danh sách chat

      // Cập nhật luôn selectedChat để hiển thị tin nhắn ngay lập tức
      const updatedChat = updatedChatList.find(chat => chat.id === selectedChat.id);
      setSelectedChat(updatedChat);

    } else {
      // Nếu không có cuộc trò chuyện nào, tạo một cuộc trò chuyện mới
      const newChat = {
        id: chatList.length + 1,
        user: `User ${chatList.length + 1}`, // Tạo tên người dùng tự động
        messages: [{ sender: 'user', content: inputMessage }],
      };
      setChatList([...chatList, newChat]); // Thêm cuộc trò chuyện mới vào danh sách
      setSelectedChat(newChat); // Chọn cuộc trò chuyện mới
    }
    
    setInputMessage(''); // Reset input message
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Kiểm tra nếu phím Enter được nhấn
      e.preventDefault(); // Ngăn form tự động submit (nếu có)
      handleSendMessage(); // Gửi tin nhắn
    }
  };

  return (
    <>

    <div>
              {/* Messenger Icon */}
              {/* {demo()} */}
      {showChatIcon === false &&
        <>
              {/* <div
                className="position-fixed rounded-circle py-1 px-1"
                style={{
                  bottom: '20px',
                  right: '20px',
                  zIndex: '9999', // Đảm bảo icon luôn nằm trên các phần tử khác
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', // Tùy chỉnh box shadow
                }}
                onClick={showChatIcon ? handleChatListToggle : null} // Sử dụng toán tử 3 ngôi

              > 
                <img
                  src="/images/mail_giphy.webp"
                  alt="Messenger"
                  style={{ width: '40px', cursor: 'pointer' }}
                />
              </div> */}
        </>
      } 
      {showChatIcon === true &&
        <>
            <div
                className="position-fixed rounded-circle py-1 px-1"
                style={{
                  bottom: '20px',
                  right: '20px',
                  zIndex: '9999', // Đảm bảo icon luôn nằm trên các phần tử khác
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)', // Tùy chỉnh box shadow
                }}
                onClick={handleChatListToggle} // Khi click vào icon sẽ mở form chat nhấn vào sẽ thành TRUE
              > 
                <img
                  src="/images/mail_giphy.webp"
                  alt="Messenger"
                  style={{ width: '40px', cursor: 'pointer' }}
                />
              </div>
        </>
      }


  {/* Chat List và Chat Box */}
  <div className="d-flex">
    {/* Danh sách các cuộc trò chuyện */}
    {showChatList && (
      <div
        className="position-fixed card"
        style={{
          bottom: '10px',
          //  right: showChat ? '420px' : '75px', // Dịch vị trí khi mở form chat
          right: isMaximized ? '580px' : showChat ? '420px' : '75px', // Dịch vị trí khi form chat mở rộng
        //       VỊ TRÍ KHI MỞ RỘNG  - VỊ TRÍ KHI ĐG MỞ CHAT  - VỊ TRÍ MẶC ĐỊNH                                                             
          zIndex: '9998',
          width: '300px',
          height: '500px',
        }}
      >
        <div className="card-header bg-light">
          <h6>Danh sách trò chuyện</h6>
        </div>
        <div className="card-body overflow-auto">
          <ListGroup>
            {chatList.map((chat) => (
              <ListGroup.Item
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                style={{ cursor: 'pointer' }}
                className="d-flex align-items-center"
              >
                {/* Hiển thị Avatar */}
                <img
                  src={`/chat_page/assets/images/users/${chat.avatar}`} // Kết hợp biến chat.avatar với đường dẫn
                  alt={`${chat.user}'s avatar`}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
                <div className="d-flex flex-column">
                  <strong>{chat.user}</strong>
                  {/* Hiển thị tin nhắn cuối cùng */}
                  <small className="text-muted">
                    {chat.messages[chat.messages.length - 1].content}
                  </small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    )}

    {/* Chat Box sẽ chỉ hiển thị khi showChat là true */}
    {showChat && selectedChat && (
      <div
        className="card position-fixed"
        style={{
          bottom: '10px', // Điều chỉnh khoảng cách từ đáy màn hình
          right: '80px',
          zIndex: '9999', // Đảm bảo form chat luôn ở trên cùng
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
          <h6 className="mb-0">{selectedChat.user}</h6>
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
              <i className={`h6 bi ${isMaximized ? 'bi-arrows-angle-contract' : 'bi-arrows-fullscreen'}`}></i>
            </Button>
            <Button
              variant="link"
              onClick={handleChatToggle}
              className="p-0 text-primary text-decoration-none"
            >
              <h5 className='mt-2'>X</h5>
            </Button>
          </div>
        </div>

        {/* Phần hiển thị tin nhắn nếu không bị thu nhỏ */}
        {!isMinimized && (
          <>
            <div className="card-body overflow-auto" style={{ height: '200px' }}>
              {selectedChat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`p-2 rounded mb-2 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                    style={{ maxWidth: '80%' }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Phần nhập liệu và nút gửi */}
            <div className="card-footer d-flex p-2">
              <Button variant="" className="me-1">
                <i className="bi bi-image-fill"></i>
              </Button>
              <Form.Control
                type="text"
                placeholder="Nhập câu hỏi tiếp theo của bạn"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown} // sự kiện key down
                className="me-2"
              />
              <Button
                variant="warning"
                className="d-flex align-items-center justify-content-center"
                onClick={handleSendMessage}
              >
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
