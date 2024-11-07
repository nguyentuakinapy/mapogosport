"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Đảm bảo đã cài đặt Bootstrap Icons
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useSWR from "swr";

export default function ChatBox() {
  interface Message {
    messageId: number;
    sender: User;
    receiver: User;
    content: string;
    createAt: Date;
    isDelete: boolean;
  }

  const [showChat, setShowChat] = useState(false); // quản lý việc hiển thị chat form
  const [showChatList, setShowChatList] = useState(false); // quản lý việc hiển thị chat form
  const [showChatIcon, setShowChatIcon] = useState(true); // quản lý việc hiển thị icon chat
  const [isMinimized, setIsMinimized] = useState(false); // quản lý trạng thái thu nhỏ của chat form
  const [isMaximized, setIsMaximized] = useState(false); // quản lý trạng thái phóng to của chat form
  const [selectedChat, setSelectedChat] = useState<string>(""); // Quản lý cuộc trò chuyện đang được chọn
  const [inputMessage, setInputMessage] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  const [chatListRealTime, setChatListRealTime] = useState<Message[]>([]);
  // const [chatListCurrentUser, setChatListCurrentUser] = useState<Message[]>([]);
  const [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useState<
    Message[]
  >([]);

  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [receiver, setReceiver] = useState<string>("nguyentuakinapy");  // Sử dụng useState cho receiver

  // Khi bấm vào một đoạn chat trong danh sách
  const handleSelectChat = (chat) => {
    console.log("username: ", chat?.username || "Không có tên");
    
    console.log("Phân quyền", chat?.authorities?.[0]?.authorityId || "Không có");
  
    setReceiver(chat?.username);  // Cập nhật receiver bằng setReceiver
    console.log("receiver ", chat?.username);
    
    setSelectedChat(chat?.username);
    setShowChat(true); // Hiển thị form chat khi bấm vào danh sách chat
  };
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUserData = JSON.parse(user) as User;
      setCurrentUser(parsedUserData);
      console.log("user từ session: ", currentUser);
    }
  }, []);
  useEffect(() => {
    console.log("currentUser sau khi set: ", currentUser); // Chạy khi currentUser thay đổi
  }, [currentUser]);

  // Hàm fetch dữ liệu messages
  const fetchMessages = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  };

// Sử dụng useSWR để fetch messages
const { data, isLoading, isError, mutate } = useSWR(
  currentUser ? `http://localhost:8080/api/messages/${currentUser.username}/${receiver}` : null,
  fetchMessages
);


  // get data dataByReceiverUsernameOrCurrentUser
  const {
    data: dataByReceiverUsernameOrCurrentUser,
    isLoading: isLoadByReceiverUsernameOrCurrentUser,
    isError: isErrorByReceiverUsernameOrCurrentUser,
    mutate: mutateByReceiverUsernameOrCurrentUser,
  } = useSWR(
    currentUser
      ? `http://localhost:8080/api/messages/receiver/${currentUser.username}`
      : null,
    fetchMessages
  );

  useEffect(() => {
    if (dataByReceiverUsernameOrCurrentUser) {
      console.log(
        "Dữ liệu nhận được từ API: ",
        dataByReceiverUsernameOrCurrentUser
      );

      // Nhóm các tin nhắn theo người gửi hoặc người nhận
      const groupedMessages = dataByReceiverUsernameOrCurrentUser.reduce(
        (acc, message) => {
          const username =
            message.receiver.username === currentUser?.username
              ? message.sender.username
              : message.receiver.username;

          if (!acc[username]) {
            acc[username] = {
              user:
                message.receiver.username === currentUser?.username
                  ? message.sender
                  : message.receiver,
              content: message.content,
              timestamp: message.createdAt,
            };
          } else if (
            new Date(message.createdAt) > new Date(acc[username].timestamp)
          ) {
            // Nếu đã có tin nhắn từ người dùng này, chỉ cập nhật nếu tin nhắn mới hơn
            acc[username].content = message.content;
            acc[username].timestamp = message.createdAt;
          }

          return acc;
        },
        {}
      );

      const groupedMessagesArray = Object.values(groupedMessages);

      setChatListCurrentUserByDMM(groupedMessagesArray);
      // setChatListCurrentUserByDMM(groupedMessagesArray as Message[]);

      console.error("Danh sách chat real-time đã nhóm: ", groupedMessagesArray);
      console.error(
        "Danh sách setChatListCurrentUserByDMM: ",
        chatListCurrentUserByDMM
      );
    }
  }, [dataByReceiverUsernameOrCurrentUser]);


  useEffect(() => {
    console.log(
      "Danh sách chat real-time đã được cập nhật: dmdmdmdmdmdmdm",
      chatListCurrentUserByDMM
    );
  }, [chatListCurrentUserByDMM]);

  useEffect(() => {
    if (data) {
      setChatListRealTime(data);
      console.error("chat list: ", chatListRealTime);
    }
  }, [data]);

  

  // Log để kiểm tra `chatListRealTime`
  useEffect(() => {
    console.log("chatListRealTime updated:", chatListRealTime);
  }, [chatListRealTime]);


  useEffect(() => {
    if (!currentUser) return;

    const socket = new WebSocket(`ws://localhost:8080/ws/chat`);

    // Khi kết nối WebSocket mở
    socket.onopen = () => {
      console.log("WebSocket is connected.");
    };

    // Khi nhận được tin nhắn mới từ WebSocket
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setChatListRealTime((prevMessages) => [...prevMessages, message]);
    };

    // Đóng kết nối khi component bị huỷ
    return () => socket.close();
  }, [currentUser]);

  const demo = () => {
    return <h1>showChatIcon: {showChatIcon.toString()}</h1>;
  };

  useEffect(() => {
    // Lấy URL từ phía client khi component đã được mount
    // setUrl(window.location.href);
    const currentPath = window.location.pathname;

    // Kiểm tra nếu đường dẫn là /chat_page thì ẩn icon chat
    if (currentPath === "/chat_page") {
      setShowChatIcon(false); // đg ở trạng hiện chat page cần ẩn
    } else {
      setShowChatIcon(true); // đg ở trang chủ cần hiện
    }
  }, []);

 
  useEffect(() =>{
    console.log("setSelectedChat: ", selectedChat);
    

  }, [selectedChat])

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
    if (inputMessage.trim() !== "") {
      const newMessage = {
        sender: currentUser,
        receiver: selectedChat,
        content: inputMessage,
        createAt: new Date(),
      };
      socket.send(JSON.stringify(newMessage));
      setInputMessage(""); // Clear input
    }
  };

  if (isLoading) return <p>Loading messages...</p>;
  if (isError) return <p>Error loading messages.</p>;
  return (
    <>
      <div>
        {/* Messenger Icon */}
        {showChatIcon === true && (
          <>
            <div
              className="position-fixed rounded-circle py-1 px-1"
              style={{
                bottom: "20px",
                right: "20px",
                zIndex: "9999", // Đảm bảo icon luôn nằm trên các phần tử khác
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)", // Tùy chỉnh box shadow
              }}
              onClick={handleChatListToggle} // Khi click vào icon sẽ mở form chat nhấn vào sẽ thành TRUE
            >
              <img
                src="/images/mail_giphy.webp"
                alt="Messenger"
                style={{ width: "40px", cursor: "pointer" }}
              />
            </div>
          </>
        )}

        {/* Chat List và Chat Box */}
        <div className="d-flex">
          {/* Danh sách các cuộc trò chuyện */}
          {showChatList && (
            <div
              className="position-fixed card"
              style={{
                bottom: "10px",
                //  right: showChat ? '420px' : '75px', // Dịch vị trí khi mở form chat
                right: isMaximized ? "580px" : showChat ? "420px" : "75px", // Dịch vị trí khi form chat mở rộng
                //       VỊ TRÍ KHI MỞ RỘNG  - VỊ TRÍ KHI ĐG MỞ CHAT  - VỊ TRÍ MẶC ĐỊNH
                zIndex: "9998",
                width: "300px",
                height: "500px",
              }}
            >
              <div className="card-header bg-light">
                <h6>Danh sách trò chuyện</h6>
              </div>
              <div className="card-body overflow-auto">
                <ListGroup>
                  CHAT LIST THEO NGƯỜI NHẬN LÀ NGƯỜI GỬI HIỆN TẠI
                  {chatListCurrentUserByDMM.map((chatGroup, index) => {
                    // Xác định người dùng trong tin nhắn có khác với người dùng hiện tại không
                    const chatUser =
                      chatGroup.user?.username !== currentUser?.username
                        ? chatGroup.user
                        : null;

                    if (!chatUser) return null; // Nếu là người dùng hiện tại, không hiển thị item này

                    return (
                      <ListGroup.Item
                        key={chatUser?.username || index} // Dùng username làm key, hoặc index nếu không có username
                        onClick={() => handleSelectChat(chatUser)}
                        className="d-flex flex-column"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={chatUser?.avatar || "Chưa Hình"}
                            alt={chatUser?.username || "Không có tên"}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <strong>
                            {index + 1} - {chatUser?.username || "Không có tên"}
                          </strong>
                        </div>
                        <div>
                          <p className="mb-1">
                            {chatGroup.content || "Không có nội dung"}
                          </p>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
          )}

          {/* Chat Box sẽ chỉ hiển thị khi showChat là true */}
          {showChat && selectedChat && (
            <div
              className="card position-fixed"
              style={{
                bottom: "10px", // Điều chỉnh khoảng cách từ đáy màn hình
                right: "80px",
                zIndex: "9999", // Đảm bảo form chat luôn ở trên cùng
                width: isMaximized ? "500px" : "340px",
                height: isMinimized ? "50px" : "500px", // auto
              }}
            >
              <div className="card-header d-flex align-items-center bg-light">
                <img
                  src="/images/logo.png"
                  alt="Chat Logo"
                  className="me-2"
                  style={{ width: "30px" }}
                />
                <h6 className="mb-0">{selectedChat}</h6>
                <div className="ms-auto">
                  <Button
                    variant="link"
                    onClick={handleMinimizeToggle}
                    title={isMinimized ? "Phóng to" : "Thu nhỏ"}
                    className="p-0"
                  >
                    <i
                      className={`h6 bi ${
                        isMinimized ? "bi-arrows-angle-expand" : "bi-dash-lg"
                      }`}
                    ></i>
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleMaximizeToggle}
                    title={isMaximized ? "Thu nhỏ" : "Phóng to"}
                    className="p-0 mx-2"
                  >
                    <i
                      className={`h6 bi ${
                        isMaximized
                          ? "bi-arrows-angle-contract"
                          : "bi-arrows-fullscreen"
                      }`}
                    ></i>
                  </Button>
                  <Button
                    variant="link"
                    onClick={handleChatToggle}
                    className="p-0 text-primary text-decoration-none"
                  >
                    <h5 className="mt-2">X</h5>
                  </Button>
                </div>
              </div>

              {/* Phần hiển thị tin nhắn nếu không bị thu nhỏ */}
              {!isMinimized && (
                <>
                  <div
                    className="card-body overflow-auto"
                    style={{ height: "200px" }}
                  >
                    {chatListRealTime.map((msg) => (
                      <div
                        key={msg.messageId}
                        className={`d-flex ${
                          msg.sender.username === currentUser?.username
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-2 rounded mb-2 ${
                            msg.sender.username === currentUser?.username
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                          style={{ maxWidth: "80%" }}
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
                      // onKeyDown={handleKeyDown} // sự kiện key down
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
