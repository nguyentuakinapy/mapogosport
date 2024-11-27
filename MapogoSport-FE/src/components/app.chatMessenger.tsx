// code mowis nah
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Đảm bảo đã cài đặt Bootstrap Icons
import axios from "axios";
import useSWR from "swr";
import "../app/globals.css";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useData } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import { IFrame } from "@stomp/stompjs";
import { toast } from "react-toastify";
import Image from "next/image";

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
  // const [selectedChat, setSelectedChat] = useState<User>(null); // Quản lý cuộc trò chuyện đang được chọn
  const [selectedChat, setSelectedChat] = useState<User>(); // Quản lý cuộc trò chuyện đang được chọn
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

  const [usernameFormUrl, setUsernameFormUrl] = useState<string>("");

  const [ownerCurrent, setOwnerCurrent] = useState<User | undefined | null>();

  const [isConnected, setIsConnected] = useState(false); // Thêm trạng thái theo dõi kết nối STOMP

  const [currentTopic, setCurrentTopic] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  // const stompClient = useRef(null);
  const stompClient = useRef<CompatClient | null>(null); // Khai báo đúng kiểu

  const path = useSearchParams();

  useEffect(() => {
    const encodedStatus = path.get("status");
    console.log("ccccccccccccccc encodedStatus", encodedStatus);
    // toast.info('sâsas '+encodedStatus)
    if (encodedStatus) {
      if (encodedStatus === "default") {
        // nếu là default thì mở sẳn admin có sẵn
        // toast.info('admi '+ adminDefault?.username)
        if (adminDefault) {
          handleSelectChat(adminDefault);
          const newParams = new URLSearchParams(path);
          newParams.delete("status");

          // Cập nhật URL bằng cách sử dụng `replaceState`
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}?${newParams.toString()}`
          );
        }
      } else {
        try {
          // Giải mã username từ Base64 và cập nhật state
          const decodedUsername = atob(encodedStatus);
          setUsernameFormUrl(decodedUsername);
        } catch (error) {
          console.error("Lỗi khi giải mã username:", error);
          setUsernameFormUrl(""); // Reset nếu giải mã thất bại
        }
      }
    } else {
      setUsernameFormUrl(""); // Reset nếu không có tham số
    }
  }, [path]); // Chạy lại mỗi khi searchParams thay đổi
  useEffect(() => {
    console.log("use name form url ", usernameFormUrl);
  }, [usernameFormUrl]);

  ////
  const rolePriority = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_OWNER", "ROLE_USER"];
  const getHighestRole = (user: User) => {
    if (!user || !user.authorities) return null;
    const userRoles = user.authorities.map((auth) => auth.role.name);
    return userRoles.sort(
      (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b)
    )[0];
  };
  const [isExitingMy, setIsExitingMy] = useState<boolean>(true);
  const [isExitingMyIfAdminDefault, setIsExitingMyAdminDefault] =
    useState<boolean>(false);

  // Cập nhật selectedChat khi adminDefault có sẵn
  useEffect(() => {
    if (
      isConnected &&
      adminDefault &&
      chatListCurrentUserByDMM.length === 0 &&
      selectedChat
      //  && selectedChat === ""

    ) {
      console.log("Đã kết nối, gọi handleSelectChat với adminDefault...");
      handleSelectChat(adminDefault); // Chỉ gọi khi isConnected là true
    } else if (ownerCurrent) {
      // ownerCurrent là kiểu user
      handleSelectChat(ownerCurrent);
    }
  }, [
    isConnected,
    adminDefault,
    chatListCurrentUserByDMM,
    selectedChat,
    ownerCurrent,
    usernameFormUrl,
  ]);

  // Xử lý kiểm tra quyền và thiết lập username nếu cần
  useEffect(() => {
    if (currentUser) {
      const highestRole = getHighestRole(currentUser);
      // toast.success("hifhr role: " + highestRole);
      // toast.success("chatListCurrentUserByDMM: "+ chatListCurrentUserByDMM.length)

      if (
        (highestRole === "ROLE_USER" ||
          highestRole === "ROLE_OWNER" ||
          highestRole === "ROLE_STAFF") &&
        chatListCurrentUserByDMM.length === 0
      ) {
        setUsername("myntd");
      } else {
        setAdminDefault(dataAdmin);
      }
    }
  }, [currentUser, chatListCurrentUserByDMM, username]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: dataFindById } = useSWR(
    username ? `http://localhost:8080/rest/user/${username}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: dataAdmin } = useSWR(
    `http://localhost:8080/rest/user/myntd`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: dataFindByIdOwner } = useSWR(
    usernameFormUrl
      ? `http://localhost:8080/rest/user/${usernameFormUrl}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Xử lý cập nhật adminDefault khi dữ liệu trả về từ API
  useEffect(() => {
    if (dataFindById) {
      setAdminDefault(dataFindById);
    }
  }, [dataFindById]);

  useEffect(() => {
    if (dataFindByIdOwner) {
      setOwnerCurrent(dataFindByIdOwner);
    }
  }, [dataFindByIdOwner]);
  useEffect(() => {
    if (ownerCurrent) {
      console.log("dataFindByIdOwnerddd ", ownerCurrent);
    }
  }, [ownerCurrent]);

  useEffect(() => {
    if (!currentUser) return;
    // Khởi tạo kết nối STOMP với WebSocket server
    const socket = new SockJS(`http://localhost:8080/ws`); // 1. kết nối server
    stompClient.current = Stomp.over(socket);

    // Kết nối tới server STOMP
    stompClient.current.connect(
      {},
      (frame: IFrame) => {
        console.log("Đã kết nối STOMP server:", frame);
        setIsConnected(true); // Đánh dấu kết nối STOMP thành công

        // topic cho nhận thông báo
        const topicDefault = `/topic/notify/${currentUser?.username}`;
        stompClient.current?.subscribe(topicDefault, (message) => {
          console.log("Nhận được message:", message.body);

          const parsedMessage = JSON.parse(message.body);
          console.log("selcect ed chat ", receiver);
          console.log("selcect ed chat ", selectedChat);

          // setChatListCurrentUserByDMM((prevChats) => {
          //   const isChatExists = prevChats.some(
          //     (item) => item.user.username === parsedMessage.sender
          //   );

          //   if (!isChatExists) {
          //     //  toast.success("có chạy vào không");
          //     const newUser: User = {
          //       username: parsedMessage.sender || "Unknown",
          //       fullname: parsedMessage.senderFullName || "Anonymous",
          //     };
          //     console.log("Thêm người gửi mới:", newUser);
          //     return [
          //       {
          //         user: newUser,
          //         content: parsedMessage.message || "",
          //         timestamp: new Date().toISOString(),
          //       },
          //       ...prevChats,
          //     ];
          //   }else{
          //     // toast.success(" ko có chạy vào không");
          //     const newUser: User = {
          //       username: parsedMessage.sender || "Unknown",
          //       fullname: parsedMessage.senderFullName || "Anonymous",
          //     };
          //     return [
          //       {
          //         user: newUser,
          //         content: parsedMessage.message || "",
          //         timestamp: new Date().toISOString(),
          //       },
          //       ...prevChats,
          //     ];

          //   }
          //   return prevChats; // Không thay đổi nếu đã tồn tại
          // });

          setChatListCurrentUserByDMM((prevChats) => {
            const existingChatIndex = prevChats.findIndex(
              (item) => item.user.username === parsedMessage.sender
            );
            console.log('existingChatIndex =>>>' + existingChatIndex);


            if (existingChatIndex !== -1) {  // == 1 là đã tồn tại
              // Nếu chat đã tồn tại, tạo một bản sao và cập nhật nội dung
              const updatedChats = [...prevChats];
              updatedChats[existingChatIndex] = {
                ...updatedChats[existingChatIndex], // Giữ lại thông tin cũ
                content: parsedMessage.message || "", // Cập nhật nội dung
                timestamp: new Date().toISOString(), // Cập nhật thời gian
              };
              return updatedChats;
            } else {  // == -1 là chưa tồn tại
              // Nếu chat chưa tồn tại, thêm mới vào đầu danh sách
              const newUser: User = {
                username: parsedMessage.sender || "Unknown",
                fullname: parsedMessage.senderFullName || "Anonymous",
              };
              return [
                {
                  user: newUser,
                  content: parsedMessage.message || "",
                  timestamp: new Date().toISOString(),
                },
                ...prevChats,
              ];
            }
          });


          console.log('setChatListCurrentUserByDMM =>>>>>>> ', chatListCurrentUserByDMM);


          toast.info(
            "Bạn nhận được tin nhắn từ " + parsedMessage.senderFullName
          );

          console.log("Sender:", parsedMessage.sender);
          console.log("Message:", parsedMessage.message);
          console.log("timestamp:", parsedMessage.timestamp);
        });
        console.log(`Đã gửi lệnh đăng ký tới topic: ${topicDefault}`);
      },
      (error: IFrame) => {
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

  const checkLogin = () => {
    let isLogin = false;
    if (currentUser) {
      isLogin = true;
    } else {
      toast.warning("Vui lòng đăng nhập để chat với chủ sân");
    }
    return isLogin;
  };

  const handleKeyEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }

    // khong lien quan den fect
    mutate();
    mutateByReceiverUsernameOrCurrentUser();
  };

  interface dataMess {
    content: string;
    username: string;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const [dataMessageTemporary, setDataMessageTemporary] = useState<dataMess | null>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        // behavior: "smooth", // Thêm smooth scrolling
      });
      mutate;
      mutateByReceiverUsernameOrCurrentUser;
    }
  }, [chatListRealTime]); // Theo dõi sự thay đổi của danh sách tin nhắn


  const handleSendMessage = () => {
    if (
      inputMessage.trim() !== "" &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const newMessage = {
        sender: currentUser?.username, // Tên người gửi
        receiver: receiver, // Tên người nhận
        content: `${inputMessage}/SENDER=${currentUser?.username}-RECEIVER=${receiver}`,
        createdAt: new Date(),
      };
      console.log("Đang gửi tin nhắn");
      console.log("newMessage ", JSON.stringify(newMessage));

      // Sắp xếp tên người gửi và người nhận theo thứ tự alphabet
      const sortedUsers = [currentUser?.username, receiver].sort();
      const topic = `/app/chat.sendMessage/${sortedUsers[0]}-${sortedUsers[1]}`;

      console.log("topic ", topic);

      // Gửi tin nhắn đến topic chung
      stompClient.current.send(topic, {}, JSON.stringify(newMessage));

      if (
        newMessage.receiver === currentUser?.username ||
        newMessage.sender === currentUser?.username
      ) {
        console.log("khong them");
      } else {
        setChatListRealTime((prevMessages) => [...prevMessages, newMessage]);
      }
      // Cập nhật danh sách tin nhắn
      console.log("chat list mớ: ", chatListRealTime);

      setInputMessage(""); // Xóa input sau khi gửi

      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }
  };

  const handleSelectChat = (chat: User) => {
    if (!checkLogin()) {
      return;
    }

    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
    if (ownerCurrent) {
      setOwnerCurrent(null);
      // setOwnerCurrent(undefined);
    }
    console.log("Đã vào với: ", chat?.username || "Không có tên");

    setReceiver(chat?.username);
    console.log("Người nhận là ", chat?.username);

    setSelectedChat(chat);
    // mới thêm 19/11
    // Kiểm tra nếu chat chưa tồn tại trong chatListCurrentUserByDMM, thì thêm mới
    setChatListCurrentUserByDMM((prevChats) => {
      const isChatExists = prevChats.some(
        (item) => item.user.username === chat.username);
      if (!isChatExists) {
        return [
          ...prevChats,
          {
            user: chat,
            content: "Chat với chủ sân nhé em ơi",
            timestamp: new Date().toISOString(),
          },
        ];

      }

      return prevChats;
    });
    // mới thêm 19/11

    if (chatListCurrentUserByDMM.length === 0 && adminDefault) {
      // toast.success("dang false");
      setShowChat(true);
      // setShowChat(false);
    } else if (chatListCurrentUserByDMM.length === 0) {
      // toast.success("chat dang null");
      setShowChat(false);
    } else {
      // toast.success("dang true");

      setShowChat(true);
    }

    console.log("ownerCurrent", ownerCurrent);

    if (ownerCurrent) {
      console.log("ownerCurrent dddddd", ownerCurrent);

      setShowChat(true);

      // // Tạo một bản sao để chỉnh sửa
      const newParams = new URLSearchParams(path);
      newParams.delete("status");

      // Cập nhật URL bằng cách sử dụng `replaceState`
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newParams.toString()}`
      );
    }

    // Tạo topic dựa trên người gửi và người nhận
    const sortedUsers = [currentUser?.username, chat.username].sort();
    const topic = `/topic/public/${sortedUsers[0]}-${sortedUsers[1]}`;
    setCurrentTopic(`${sortedUsers[0]}-${sortedUsers[1]}`);

    // Kiểm tra xem topic đã đăng ký chưa
    if (!subscribedTopics.includes(topic)) {
      // Nếu chưa đăng ký, thì tiến hành đăng ký
      stompClient.current?.subscribe(topic, (message) => {
        // let receivedMessage = JSON.parse(message.body);
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message: ", receivedMessage);

        let msgTopic: string = "";
        const arrDestination = message.headers.destination.split("/");
        if (arrDestination.length > 0) {
          msgTopic = arrDestination[arrDestination.length - 1];
        }

        receivedMessage["topic"] = msgTopic;

        (receivedMessage["tempReceiver"] = receivedMessage.receiver),
          (receivedMessage["tempSender"] = receivedMessage.sender);

        console.log("currentUser message: ", currentUser);
        console.log("receiver message: ", receiver);
        console.log("selectedChat message: ", selectedChat);
        console.log("chat?.username message: ", chat?.username);

        if (
          (receivedMessage.receiver === currentUser?.username &&
            receivedMessage.sender === chat?.username) ||
          (receivedMessage.receiver === chat?.username &&
            receivedMessage.sender === currentUser?.username)
        ) {
          setChatListRealTime((prevMessages) => [
            ...prevMessages,
            receivedMessage,
          ]);

          setDataMessageTemporary({
            content: receivedMessage.content,
            username: chat?.username,
          });
        }
      });
      // toast.warning('sleceffff '+ selectedChat?.username)

      // Cập nhật trạng thái đã đăng ký topic
      setSubscribedTopics((prevTopics) => [...prevTopics, topic]);
    }
  };
  useEffect(() => {
    console.log("currentUser sau khi set: ", currentUser); // Chạy khi currentUser thay đổi
    // mutate();
    // mutateByReceiverUsernameOrCurrentUser();
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
    mutate: mutateByReceiverUsernameOrCurrentUser,
  } = useSWR(
    currentUser
      ? `http://localhost:8080/api/messages/receiver/${currentUser.username}`
      : null,
    fetchMessages
  );

  useEffect(() => {
    if (dataByReceiverUsernameOrCurrentUser) {
      // Nhóm các tin nhắn theo người gửi hoặc người nhận
      let foundMyntd = false;
      let tempAdminDefault = null;

      const groupedMessages = dataByReceiverUsernameOrCurrentUser.reduce(
        (acc, message) => {
          const username =
            message.receiver.username === currentUser?.username
              ? message.sender.username
              : message.receiver.username;

          // Check if username is "myntd" (either sender or receiver)
          if (
            message.sender.username === "myntd" ||
            message.receiver.username === "myntd"
          ) {
            // toast.info("User myntd có xuất hiện ở hội thoại");
            foundMyntd = true;
            setIsExitingMy(false);
          } else if (!tempAdminDefault) {
            // toast.info("không có");

            tempAdminDefault = adminDefault;
            // toast.info('s111111111111111111111' +tempAdminDefault)
            // toast.info('sasssssss'+ adminDefault);
            // console.log('dsddddddddddddd lúc này tooinf tại chưa  '+ adminDefault?.username);

            // toast.info('sdsddd '+adminDefault )
          }
          if (!foundMyntd) {
            setIsExitingMy(true);
            setAdminDefault(tempAdminDefault);
            setIsExitingMyAdminDefault(true); // Chỉ hiển thị admin nếu không có "myntd"
          }
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

      // mới thêm 19/11

      if (
        ownerCurrent &&
        !groupedMessagesArray.some(
          (item) => item.user.username === ownerCurrent.username
        )
      ) {
        setChatListCurrentUserByDMM((prevChats) => [
          ...prevChats,
          {
            user: ownerCurrent,
            content: "",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
      // mới thêm 19/11

      console.log("Danh sách chat real-time đã nhóm: ", groupedMessagesArray);
      console.log(
        "Danh sách setChatListCurrentUserByDMM: ",
        chatListCurrentUserByDMM
      );
    }
  }, [dataByReceiverUsernameOrCurrentUser]);

  const formatTime = (createAt: Date | string) => {
    const date = createAt instanceof Date ? createAt : new Date(createAt);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    console.log("Danh sách chat đã cập nhật: ", chatListCurrentUserByDMM);
    console.log("Admin mặc định: ", adminDefault);
    console.log("isExitingMy: ", isExitingMy);
  }, [chatListCurrentUserByDMM, adminDefault, isExitingMy]);
  useEffect(() => {
    console.log(
      "Danh sách chat real-time đã được cập nhật: dmdmdmdmdmdmdm",
      chatListCurrentUserByDMM
    );
  }, [chatListCurrentUserByDMM, adminDefault, isExitingMy]);

  useEffect(() => {
    // if (data) {
    //   setChatListRealTime(data);
    //   console.log("chat list: ", chatListRealTime);
    // }                    cũ

    if (data) {
      const tempData = data.map((item) => {
        const sortedUsers = [
          item.receiver.username,
          item.sender.username,
        ].sort();
        return {
          ...item,
          topic: `${sortedUsers[0]}-${sortedUsers[1]}`,

          //   tempReceiver: item.receiver.username,
          // tempSender: item.sender.username
        };
      });
      setChatListRealTime(tempData);
      console.error("chat list: ", chatListRealTime);
    } //               mới
  }, [data]);

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
    // toast.info("đã đổi chat ");
  }, [selectedChat]);

  const handleChatToggle = () => {
    // toast.success('show chat hien jtai là'+ showChat)
    // toast.success('show chat hien jtai '+ adminDefault)

    setShowChat(!showChat); //nếu true thì thực hiện mở form chat

    if (adminDefault) {
      handleSelectChat(adminDefault);
    }
  };

  const handleToggle = () => {
    setShowChat(false);
  };

  const handleChatAutoTrue = (chat: User) => {
    // toast.success(chat?.username);
    setShowChat(true); //nếu true thì thực hiện mở form chat
    handleSelectChat(chat);
    // toast.success(chat?.email);
  };

  const handleChatListToggle = () => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để sử dụng chat");
    } else {
      setShowChatList(!showChatList); //nếu true thì thực hiện mở form chat
    }
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized); // nếu true thì thực hiện thu nhỏ
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized); // nếu true thì thực hiện phóng to
  };
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
  const filteredChatList = chatListCurrentUserByDMM.filter((chatGroup) =>
    chatGroup.user?.username.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  console.log("receiver====>", receiver);
  console.log("current topic====>", currentTopic);

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
              <Image
                src="/images/mail_giphy.webp"
                alt="message"
                width={40}
                height={40}
                style={{ cursor: "pointer" }}
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
              <div className="card-header bg-light py-3">
                <h6>Danh sách trò chuyện</h6>
              </div>
              <div className="card-body overflow-auto">
                <div
                  className="small-input"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    className="mb-2 px-3 form-control"
                    style={{ width: "300px", height: "30px" }} // Điều chỉnh kích thước tại đây
                  />
                </div>
                <ListGroup>
                  {chatListCurrentUserByDMM.length > 0 ? (
                    filteredChatList.map((chatGroup, index) => {
                      const chatUser =
                        chatGroup.user?.username !== currentUser?.username ? chatGroup.user : null;

                      if (!chatUser) return null;

                      // console.log('sssssssss ',chatUser);
                      // console.log('chat group time ', formatTime(chatGroup.timestamp));
                      return (
                        <ListGroup.Item
                          key={chatUser?.username || index}
                          onClick={() => handleSelectChat(chatUser)}
                          className="d-flex flex-column"
                        >
                          <div className="d-flex align-items-center ">
                            <Image
                              src={
                                chatUser?.avatar
                                  ? chatUser.avatar
                                  : "/chat_page/assets/images/users/user-5.png"
                              }
                              alt={chatUser?.username || "Không có tên"}
                              width={40}
                              height={40}
                              style={{
                                // width: "40px",
                                // height: "40px",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                              onError={(e) => {

                                e.currentTarget.src =
                                  "/chat_page/assets/images/users/user-8.png"; // Ảnh mặc định
                              }}
                            />

                            <strong>
                              {index + 1} -{" "}
                              {chatUser?.fullname || "Không có tên"}
                            </strong>
                          </div>
                          <div className=" mt-1 row">
                            <p className=" col text-start">
                              {dataMessageTemporary === null
                                ? chatGroup.content
                                : chatUser.username ===
                                  dataMessageTemporary.username
                                  ? dataMessageTemporary.content
                                  : chatGroup.content}
                              {/* {chatGroup.content || "Không có nội dung"} */}
                            </p>
                            {/* <p className="col text-end"> {formatTime(chatGroup.timestamp)}</p> */}
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <div className="text-center ">
                      <ListGroup.Item
                        onClick={() => handleChatToggle()}
                        // onClick={() => handleChatAutoTrue(adminDefault)}
                        className="d-flex flex-column rounded"
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            src={
                              adminDefault?.avatar
                                ? adminDefault?.avatar
                                : "/chat_page/assets/images/users/user-5.png"
                            }
                            alt={adminDefault?.username || "Không có tên"}
                            width={40}
                            height={40}
                            style={{
                              // width: "40px",
                              // height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <strong>
                            {adminDefault?.fullname
                              ? adminDefault?.fullname
                              : "Không có tên"}
                            s
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
                  {/* sdsds */}
                  {isExitingMyIfAdminDefault && isExitingMy && adminDefault ? (
                    <div className="text-center ">
                      <ListGroup.Item
                        onClick={() => handleChatAutoTrue(adminDefault)}
                        className="d-flex flex-column rounded"
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            src={
                              adminDefault?.avatar
                                ? adminDefault?.avatar
                                : "/chat_page/assets/images/users/user-5.png"
                            }
                            alt={adminDefault?.username || "Không có tên"}
                            width={40}
                            height={40}
                            style={{
                              // width: "40px",
                              // height: "40px",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                          />
                          <strong>
                            {adminDefault?.fullname
                              ? "Admin Mapogo"
                              : "Không có tên"
                            }
                            g
                          </strong>
                        </div>
                        <div>
                          <p className="mb-1 r-100">Chat với admin</p>
                        </div>
                      </ListGroup.Item>
                    </div>
                  ) : null}
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
                <Image
                  src="/images/logo.png"
                  alt="Chat Logo"
                  className="me-2"
                  // style={{ width: "30px" }}
                  width={30}
                  height={30}
                />
                <h6 className="mb-0 title">{selectedChat?.fullname}</h6>
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
                    onClick={handleToggle}
                    // onClick={handleChatToggle}
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
                    ref={messageListRef}
                    className="card-body overflow-auto"
                    style={{ height: "200px" }}
                  >
                    {chatListRealTime
                      .filter(
                        (itemMessage) =>
                          (itemMessage.receiver.username ||
                            (itemMessage.tempReceiver ===
                              currentUser?.username &&
                              itemMessage.sender.username) ||
                            itemMessage.tempSender === receiver ||
                            itemMessage.receiver.username ||
                            (itemMessage.tempReceiver === receiver &&
                              itemMessage.sender.username) ||
                            itemMessage.tempSender === currentUser?.username) &&
                          currentTopic === itemMessage.topic
                      )
                      .map((msg, index) => {
                        // Log nội dung và thời gian của tin nhắn
                        // console.log(`Message #${index + 1}:`, msg);
                        // console.log(`Timestamp for message #${index + 1}:`, msg.timestamp);

                        return (
                          <div
                            key={msg.messageId || index}
                            className={`d-flex ${msg.sender.username === currentUser?.username ||
                              msg.sender === currentUser?.username
                              ? "justify-content-end"
                              : "justify-content-start"
                              }`}
                          >
                            {/* <div
                              className={`p-2 rounded mb-2 ${
                                msg.sender.username === currentUser?.username ||
                                msg.sender === currentUser?.username
                                  ? "bg-primary text-white"
                                  : "bg-light text-dark"
                              }`}
                          >

                            <div
                              className={`p-2 rounded mb-2`}
                              style={{
                                maxWidth: "80%",
                                backgroundColor:

                                  msg.sender.username ===
                                    currentUser?.username ||
                                    msg.sender === currentUser?.username
                                    ? "#66c7ff" // Màu dành cho tin nhắn gửi đi
                                    : "#f0f0f0", // Màu dành cho tin nhắn nhận được
                                color:
                                  msg.sender.username ===
                                    currentUser?.username ||
                                    msg.sender === currentUser?.username

                                    ? "black" // Màu chữ cho tin nhắn gửi đi
                                    : "black", // Màu chữ cho tin nhắn nhận được
                              }}
                            >
                              {msg.content}
                              {/* Hiển thị thời gian nếu tồn tại */}
                            <em
                              className="mt-2"
                              style={{
                                display: "block",
                                fontSize: "0.8em",
                                color: "black",
                              }}
                            >
                              {msg.createdAt
                                ? formatTime(msg.createdAt)
                                : "Không có thời gian"}
                            </em>
                          </div>
                        );
                      })}
                  </div>
                  {/* Phần nhập liệu và nút gửi */}
                  <div className="card-footer d-flex p-2">
                    <Form.Control
                      ref={inputRef}
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
      </div >
    </>
  );
}
