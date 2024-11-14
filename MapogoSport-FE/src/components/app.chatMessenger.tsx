
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Đảm bảo đã cài đặt Bootstrap Icons
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useSWR from "swr";

import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useData } from "@/app/context/UserContext";
import { toast } from "react-toastify";

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
  const [subscribedTopics, setSubscribedTopics] = useState([]);


  // const [currentUser, setCurrentUser] = useState<User | null>();
  const currentUser = useData();

  const [receiver, setReceiver] = useState<string>(""); // Sử dụng useState cho receiver

  const [username, setUsername] = useState<string>("");
  const [adminDefault, setAdminDefault] = useState<User | undefined>();

  const [isConnected, setIsConnected] = useState(false); // Thêm trạng thái theo dõi kết nối STOMP

  const stompClient = useRef(null);

  ////
  const rolePriority = ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_STAFF", "ROLE_USER"];
  const getHighestRole = (user: User) => {
    if (!user || !user.authorities) return null;
    const userRoles = user.authorities.map((auth) => auth.role.name);
    return userRoles.sort((a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b))[0];
  };

  // Cập nhật selectedChat khi adminDefault có sẵn
  useEffect(() => {
    if (isConnected && adminDefault && chatListCurrentUserByDMM.length === 0 && selectedChat === "") {
      console.log("Đã kết nối, gọi handleSelectChat với adminDefault...");
      handleSelectChat(adminDefault);  // Chỉ gọi khi isConnected là true
    }
  }, [isConnected, adminDefault, chatListCurrentUserByDMM, selectedChat]);


  // Xử lý kiểm tra quyền và thiết lập username nếu cần
  useEffect(() => {
    if (currentUser) {
      const highestRole = getHighestRole(currentUser);
      // toast.success("hifhr role: "+ highestRole)
      // toast.success("chatListCurrentUserByDMM: "+ chatListCurrentUserByDMM.length)

      if ((highestRole === "ROLE_USER" || highestRole === "ROLE_OWNER") && chatListCurrentUserByDMM.length === 0) {
        setUsername("myntd");
      }
    }
  }, [currentUser, chatListCurrentUserByDMM, username]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: dataFindById } = useSWR(
    username ? `http://localhost:8080/rest/user/${username}` : null,
    fetcher,
    { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  // Xử lý cập nhật adminDefault khi dữ liệu trả về từ API
  useEffect(() => {
    if (dataFindById) {
      setAdminDefault(dataFindById);
    }
  }, [dataFindById]);
  ///

  useEffect(() => {
    if (!currentUser) return;

    // Khởi tạo kết nối STOMP với WebSocket server
    const socket = new SockJS(`http://localhost:8080/ws`);  // 1. kết nối server
    stompClient.current = Stomp.over(socket);

    // Kết nối tới server STOMP
    stompClient.current.connect(
      {},
      (frame) => {
        console.log("Đã kết nối STOMP server:", frame);
        setIsConnected(true); // Đánh dấu kết nối STOMP thành công

      },
      (error) => {
        console.log("Lỗi kết nối tới STOMP server:", error);
        setIsConnected(false); // Đánh dấu kết nối STOMP thành công

      }
    );

    // Đóng kết nối khi component bị hủy
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log("Disconnected from STOMP server");
        });
      }
    };
  }, [currentUser]);


  const [topicCurrent, setTopicCurrent] = useState<string>("");

  useEffect(() => {
    if(!isLoadByReceiverUsernameOrCurrentUser){
       if (topicCurrent && isConnected && !subscribedTopics.includes(topicCurrent)) {
      console.log("Đăng ký topic:", topicCurrent);

      // Đăng ký topic
      const subscription = stompClient.current.subscribe(topicCurrent, (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (
          receivedMessage.sender === currentUser?.username ||
          receivedMessage.receiver === currentUser?.username
        ) {
          setChatListRealTime((prevMessages) => [...prevMessages, receivedMessage]);
          mutate();
          mutateByReceiverUsernameOrCurrentUser();
        }
      });

      // Thêm topic vào danh sách đã đăng ký
      setSubscribedTopics((prevTopics) => [...prevTopics, topicCurrent]);

      // Hủy đăng ký khi topicCurrent thay đổi hoặc component bị hủy
      return () => {
        console.log("Hủy đăng ký topic:", topicCurrent);
        subscription.unsubscribe();
        setSubscribedTopics((prevTopics) => prevTopics.filter((topic) => topic !== topicCurrent));
      };
    }
    }
   
  }, [topicCurrent, isConnected]);  // useEffect sẽ chạy khi topicCurrent hoặc isConnected thay đổi

  const handleSelectChat = (chat: User) => {
    console.log("Đã vào với: ", chat?.username || "Không có tên");

    setReceiver(chat?.username);
    console.log("Người nhận là ", chat?.username);

    setSelectedChat(chat?.username);
    if(chatListCurrentUserByDMM.length === 0){
      setShowChat(false);
    }else{
      setShowChat(true);
    }
    

    // Tạo topic dựa trên người gửi và người nhận
    const sortedUsers = [currentUser?.username, chat.username].sort();
    const topic = `/topic/public/${sortedUsers[0]}-${sortedUsers[1]}`;

    // Cập nhật topic hiện tại (sẽ kích hoạt useEffect để đăng ký hoặc hủy đăng ký)
    setTopicCurrent(topic);
    console.log("Topic hiện tại là:", topic);
  };



  const handleKeyEnter = () => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  const handleSendMessage = () => {
    if (
      inputMessage.trim() !== "" &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const newMessage = {
        sender: currentUser.username, // Tên người gửi
        receiver: receiver, // Tên người nhận
        content: `${inputMessage}/SENDER=${currentUser?.username}-RECEIVER=${receiver}`,
        createdAt: new Date(),
      };
      console.log("Đang gửi tin nhắn");
      console.log("newMessage ", JSON.stringify(newMessage));

      // Sắp xếp tên người gửi và người nhận theo thứ tự alphabet
      const sortedUsers = [currentUser.username, receiver].sort();
      const topic = `/app/chat.sendMessage/${sortedUsers[0]}-${sortedUsers[1]}`;

      console.log("topic ", topic);


      // Gửi tin nhắn đến topic chung
      stompClient.current.send(topic, {}, JSON.stringify(newMessage));

      if (newMessage.receiver === currentUser?.username || newMessage.sender === currentUser?.username) {
        console.log("khong them");

      } else {
        setChatListRealTime((prevMessages) => [...prevMessages, newMessage]);

      }
      // Cập nhật danh sách tin nhắn
      console.log("chat list mớ: ", chatListRealTime);

      setInputMessage(""); // Xóa input sau khi gửi
    }

  };

  useEffect(() => {
    console.log("currentUser sau khi set: ", currentUser); // Chạy khi currentUser thay đổi
    mutate()
    mutateByReceiverUsernameOrCurrentUser()
  }, [currentUser]);


  // Hàm fetch dữ liệu messages
  const fetchMessages = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  };

  // Sử dụng useSWR để fetch messages
  const { data, isLoading, isError, mutate } = useSWR(
    currentUser && receiver
      ? `http://localhost:8080/api/messages/${currentUser.username}/${receiver}`
      : null,
    fetchMessages
  );


  // get data dataByReceiverUsernameOrCurrentUser
  const {
    data: dataByReceiverUsernameOrCurrentUser,
    isLoading: isLoadByReceiverUsernameOrCurrentUser,
    error: isErrorByReceiverUsernameOrCurrentUser,
    mutate: mutateByReceiverUsernameOrCurrentUser,
  } = useSWR(
    currentUser
      ? `http://localhost:8080/api/messages/receiver/${currentUser.username}`
      : null,
    fetchMessages
  );

  useEffect(() => {
    if (dataByReceiverUsernameOrCurrentUser) {
      // console.log(
      //   "Dữ liệu nhận được từ API: ",
      //   dataByReceiverUsernameOrCurrentUser
      // );

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

      console.log("Danh sách chat real-time đã nhóm: ", groupedMessagesArray);
      console.log(
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
      console.log("chat list: ", chatListRealTime);
    }
  }, [data]);


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

  useEffect(() => {
    console.log("setSelectedChat: ", selectedChat);
  }, [selectedChat]);


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
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
  const filteredChatList = chatListCurrentUserByDMM.filter((chatGroup) =>
    chatGroup.user?.username
      .toLowerCase()
      .includes(searchKeyword.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
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
              // onClick={username != "" ? handleChatToggle : handleChatListToggle }
              onClick={handleChatListToggle}
            // Khi click vào icon sẽ mở form chat nhấn vào sẽ thành TRUE
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
                  {chatListCurrentUserByDMM.length > 0 ? (
                    filteredChatList.map((chatGroup, index) => {
                      const chatUser =
                        chatGroup.user?.username !== currentUser?.username
                          ? chatGroup.user
                          : null;

                      if (!chatUser) return null;
                      <div className="small-input" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Tìm kiếm người dùng..."
                          value={searchKeyword}
                          onChange={handleSearchChange}
                          className="mb-2 px-3 form-control"
                          style={{ width: "300px", height: "30px" }} // Điều chỉnh kích thước tại đây
                        />
                      </div>
                      return (

                        <ListGroup.Item
                          key={chatUser?.username || index}
                          onClick={() => handleSelectChat(chatUser)}
                          className="d-flex flex-column"
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={chatUser?.avatar || '/chat_page/assets/images/users/user-5.png'}
                              alt={chatUser?.username || "Không có tên"}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                            <strong>
                              {index + 1} - {chatUser?.fullname || "Không có tên"}
                            </strong>
                          </div>
                          <div>
                            <p className="mb-1">{chatGroup.content || "Không có nội dung"}</p>
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <div className="text-center ">
                      <ListGroup.Item
                         
                          onClick={() => handleChatToggle()}
                          className="d-flex flex-column rounded"
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={adminDefault?.avatar || '/chat_page/assets/images/users/user-5.png'}
                              alt={adminDefault?.username || "Không có tên"}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                            <strong>
                              {adminDefault?.fullname || "Không có tên"}
                            </strong>
                          </div>
                          <div>
                            <p className="mb-1 r-100">Chat với admin</p>
                          </div>
                        </ListGroup.Item>
                        {/* <i className="bi bi-emoji-frown h1 "></i>
                      <p className="text-center h6 mt-2">Chưa có danh sách chat</p>
                       */}
                    </div>
                      
                  )}
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
                      className={`h6 bi ${isMinimized ? "bi-arrows-angle-expand" : "bi-dash-lg"
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
                      className={`h6 bi ${isMaximized
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
                    {chatListRealTime.map((msg, index) => (
                      <div
                        key={msg.messageId || index}
                        className={`d-flex ${msg.sender.username === currentUser?.username ||
                          msg.sender === currentUser?.username

                          ? "justify-content-end"
                          : "justify-content-start"
                          }`}
                      >

                        <div
                          className={`p-2 rounded mb-2 ${msg.sender.username === currentUser?.username ||
                            msg.sender === currentUser?.username

                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                            }`}
                          style={{ maxWidth: "80%" }}
                        >

                          {msg.content}
                          {/* {msg.isDelete ? "Đã xóa tin nhắn" : msg.content}  */}


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
                      onKeyDown={handleKeyEnter} // sự kiện key down
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