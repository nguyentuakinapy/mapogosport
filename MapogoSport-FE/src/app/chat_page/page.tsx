'use client'; // Chỉ định rằng đây là một component client-side trong Next.js
import { useState } from "react"; // Nhập hook useState từ React để quản lý trạng thái
import { Container, Row, Col, ListGroup, InputGroup, FormControl, Button, Form, Image } from 'react-bootstrap'; // Nhập các thành phần từ React Bootstrap
import './types/chat_page.scss'; // Nhập file SCSS để định dạng cho trang chat

const MessengerPage = () => {
  
  // Khởi tạo trạng thái messages với một số tin nhắn mẫu
  const [messages, setMessages] = useState([
    { type: "receive", text: "Hello bạn?", img: "/chat_page/assets/images/users/user-6.png" },
    { type: "reply", text: "Hỏi chấm?" },
    { type: "receive", text: "Mai đi chơi hem", img: "/chat_page/assets/images/users/user-6.png" },
    { type: "reply", text: "Thật sao? Lúc mấy giờ?" },
    { type: "receive", text: "Tiệc bắt đầu lúc 8:00 tối, và mình thật sự nghĩ bạn nên đi.", img: "/chat_page/assets/images/users/user-6.png" },
    { type: "reply", text: "Vậy ai sẽ đi dự tiệc đó?" },
    { type: "receive", text: "Tất cả mọi người từ trường.", img: "/chat_page/assets/images/users/user-6.png" },
    { type: "reply", text: "Bạn làm sao biết tiệc sẽ vui như vậy?" },
    { type: "reply", text: "Bạn làm sao biết tiệc sẽ vui như vậy?" },
    { type: "reply", text: "Bạn làm sao biết tiệc sẽ vui như vậy?" },
    { type: "reply", text: "Bạn làm sao biết tiệc sẽ vui như vậy?" },
    { type: "receive", text: "Tiệc này sẽ có DJ, đồ ăn và đồ uống.", img: "/chat_page/assets/images/users/user-6.png" },
  ]);

  const [inputValue, setInputValue] = useState(''); // Khởi tạo trạng thái cho input tin nhắn là rỗng
  const [searchValue, setSearchValue] = useState(''); // Khởi tạo trạng thái tìm kiếm
  const [chatList, setChatList] = useState([ // Khởi tạo danh sách người dùng chat
    { id: 1, avatar: '/chat_page/assets/images/users/user-6.png', user: 'Mỵ Mỵ', messages: messages },
    { id: 2, avatar: '/chat_page/assets/images/users/user-5.png', user: 'Thành Nger', messages: [] },
    { id: 3, avatar: '/chat_page/assets/images/users/user-8.png', user: 'Tú Le', messages: [] },
    { id: 4, avatar: '/chat_page/assets/images/users/user-10.png', user: 'Bé Hùng', messages: [] },
    { id: 5, avatar: '/chat_page/assets/images/users/user-13.png', user: 'Thành bến tre', messages: [] }
    // Thêm nhiều người dùng nếu cần
  ]);

    // Khởi tạo trạng thái activeUser với người dùng mặc định
  const [activeUser, setActiveUser] = useState(chatList[0]?.user); // Để dấu '?' để tránh trường hợp nếu mảng r


  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Cập nhật giá trị input tin nhắn khi người dùng nhập
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value); // Set giá trị SearchValue ==  từ khóa người dùng nhập vào
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    if (inputValue.trim() === '') return; // Không gửi tin nhắn trống

    // Thêm tin nhắn mới vào trạng thái messages
    setMessages(prevMessages => [   // prevMessage đại diện cho mảng chứa tin nhắn trước đó, và add tin nhắn mới vòa
      ...prevMessages,              // sau đó cập nhật lại mảng mới
      { type: "reply", text: inputValue }
    ]);

    // Cập nhật tin nhắn mới nhất trong danh sách chat
    const updatedChatList = chatList.map(chat => { // là một biến đại diện cho từng đối tượng trong mảng chatList trong mỗi lần lặp.
      if (chat.user === activeUser) {  // activeUser được cập nhật khi bấm vào chat list
        return {
          ...chat,
          messages: [...chat.messages, { type: "reply", text: inputValue }] // Thêm tin nhắn vào danh sách của người dùng
        };
      }
      return chat; // Trả về chat không thay đổi nếu không phải người dùng hoạt động
    });

    setChatList(updatedChatList); // Cập nhật danh sách chat để phù hợp với mọi cuộc đối thoại
    setInputValue(''); // Xóa input sau khi gửi
  };

  // Lọc danh sách chat theo giá trị tìm kiếm
  const filteredChatList = chatList.filter(chat => 
    chat.user.toLowerCase().includes(searchValue.toLowerCase()) // Kiểm tra nếu tên người dùng bao gồm giá trị tìm kiếm
                                  // searchValue được thay đổi qua hàm handleSearchChange -> hàm chỉ lấy giá trị của input
  );

  return (
    <Container fluid className="d-flex vh-100"> {/* Container chính */}
      <Row className="w-100 flex-grow-1"> {/* Dòng chính chứa các cột */}
        <Col md={3} xs={3} className="border-end p-0"> {/* Cột bên trái cho danh sách chat */}
          <div className="p-3">
            <div className="d-flex align-items-center mb-4"> {/* Thông tin người dùng hiện tại */}
              <Image
                src="/chat_page/assets/images/users/user-4.jpg" // Ảnh đại diện
                className="rounded-circle me-2"
                alt="Người dùng hội thoại"
                width={50}
                height={50}
              />
              <div>
                <p className="mb-1">Nguyễn Võ Quốc Anh</p> {/* Tên người dùng hiện tại */}
              </div>
            </div>

            <InputGroup className="mb-3"> {/* Nhóm input cho ô tìm kiếm */}
              <FormControl
                placeholder="Tìm kiếm" // Placeholder cho ô tìm kiếm
                aria-label="Tìm kiếm"
                aria-describedby="basic-addon2"
                value={searchValue} // Giá trị ô tìm kiếm
                onChange={handleSearchChange} // Gọi hàm khi giá trị thay đổi
              />
              <Button variant="primary"> {/* Nút tìm kiếm */}
                <i className="bi bi-search"></i> {/* Biểu tượng tìm kiếm */}
              </Button>
            </InputGroup>

            <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}> {/* Cuộn dọc cho danh sách chat */}
              <ListGroup className="rounded"> {/* Danh sách các chat */}
                {filteredChatList.map(chat => ( // Lặp qua danh sách chat đã lọc
                  <ListGroup.Item
                    key={chat.id} // Khóa duy nhất cho mỗi mục
                    onClick={() => { // Xử lý khi nhấp vào một chat
                      setActiveUser(chat.user); // Cập nhật người dùng hoạt động
                      setMessages(chat.messages); // Cập nhật tin nhắn cho người dùng đó
                    }}
                    className="d-flex align-items-center text-dark border border-0 list_chat" // Định dạng cho mục chat
                  >
                    <Image
                      src={chat.avatar} // Ảnh đại diện của người dùng
                      className="rounded-circle me-2"
                      alt="Người dùng"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="mb-1">{chat.user}</p> {/* Tên người dùng */}
                      {/* Hiển thị tin nhắn cuối cùng */}
                      <small>{chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Chưa có tin nhắn nào"}</small> {/* Tin nhắn cuối cùng hoặc thông báo */}
                    </div>
                  </ListGroup.Item>
                ))}
                {/* Hiển thị thông báo khi không tìm thấy kết quả */}
                {filteredChatList.length === 0 && (
                  <ListGroup.Item className="text-center">
                    Không tìm thấy người dùng nào. {/* Thông báo khi không tìm thấy ai */}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          </div>
        </Col>

        <Col md={9} xs={9} className="d-flex flex-column"> {/* Cột bên phải cho tin nhắn */}
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center"> {/* Thanh tiêu đề cho tin nhắn */}
            <div className="d-flex align-items-center">
              <Image
                src={chatList.find(chat => chat.user === activeUser)?.avatar} // Ảnh đại diện của người dùng đang hoạt động
                className="rounded-circle me-2"
                alt="Người dùng"
                width={50}
                height={50}
              />
              <span>{activeUser}</span> {/* Tên người dùng đang hoạt động */}
            </div>
          </div>

          <div className="flex-grow-1 p-3 overflow-auto chat-content" style={{ maxHeight: 'calc(100vh - 200px)' }}> {/* Khung nội dung chat với cuộn dọc */}
            <ul className="list-unstyled"> {/* Danh sách tin nhắn */}
              {messages.map((message, index) => ( // Lặp qua danh sách tin nhắn
                <li key={index} className={`mb-3 d-flex ${message.type === "reply" ? "justify-content-end" : ""}`}> {/* Định dạng cho từng tin nhắn */}
                  {message.type === "receive" && ( // Nếu tin nhắn là nhận
                    <Image
                      src={message.img} // Ảnh đại diện của người gửi
                      className="rounded-circle me-2"
                      alt="Người dùng"
                      width={40}
                      height={40}
                    />
                  )}
                  <div className={`message-bubble p-2 rounded ${message.type === "reply" ? "bg-primary text-white" : "bg-light"}`}> {/* Bóng tin nhắn với màu khác nhau cho tin nhắn nhận và trả lời */}
                    <p className="mb-0">{message.text}</p> {/* Văn bản của tin nhắn */}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="message-input w-100 bg-light border-top py-3"> {/* Khung nhập tin nhắn */}
            <div className="container">
              <form className="d-flex align-items-center justify-content-between" onSubmit={handleSubmit}> {/* Form để gửi tin nhắn */}
                <div className="d-flex align-items-center gap-2"> {/* Các nút cho các hành động khác */}
                  <button type="button" className="btn btn-icon">
                    <i className="bi bi-camera-fill"></i> {/* Nút camera */}
                  </button>
                </div>

                <div className="input-group flex-grow-1 mx-2"> {/* Nhóm input cho văn bản tin nhắn */}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tin nhắn..." // Placeholder cho input tin nhắn
                    aria-label="Nhập tin nhắn..."
                    value={inputValue} // Giá trị input
                    onChange={handleInputChange} // Gọi hàm khi giá trị thay đổi
                  />
                </div>
                <button type="submit" className="btn btn-primary"> {/* Nút gửi tin nhắn */}
                  {/* Gửi */}<i class="bi bi-send-fill"></i>
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MessengerPage; // Xuất component MessengerPage
