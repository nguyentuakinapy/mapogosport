// code mowis nah
"use client";
import React, { useState, useEffect, useRef } from "react";
import {  Button, ListGroup } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Đảm bảo đã cài đặt Bootstrap Icons
import axios from "axios";
import useSWR from "swr";
import "../app/globals.css";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useData } from "@/app/context/UserContext";
import { useSearchParams } from "next/navigation";
import { IFrame } from "@stomp/stompjs";
import { removeVietnameseTones } from './Utils/Format';

import { toast } from "react-toastify";
import InputChat from "./InputChat/InputChat";
import { isString } from "lodash";
import { useImmer } from "use-immer";

export default function ChatBox() {
  interface Message {
    messageId: number;
    sender: User;
    receiver: User;
    content: string;
    createAt: Date;
    isDelete: boolean;
    user?: User;
    tempReceiver?:string
    tempSender?:string
    topic?:string
  }

  const [showChat, setShowChat] = useState(false); // quản lý việc hiển thị chat form
  const [showChatList, setShowChatList] = useState(false); // quản lý việc hiển thị chat form
  const [showChatIcon, setShowChatIcon] = useState(true); // quản lý việc hiển thị icon chat
  const [isMinimized, setIsMinimized] = useState(false); // quản lý trạng thái thu nhỏ của chat form
  const [isMaximized, setIsMaximized] = useState(false); // quản lý trạng thái phóng to của chat form
  // const [selectedChat, setSelectedChat] = useState<User>(null); // Quản lý cuộc trò chuyện đang được chọn
  const [selectedChat, setSelectedChat] = useState<User>(); // Quản lý cuộc trò chuyện đang được chọn
  // const [inputMessage, setInputMessage] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  const [chatListRealTime, setChatListRealTime] = useState<Message[]>([]);
  // const [chatListCurrentUser, setChatListCurrentUser] = useState<Message[]>([]);
  // const [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useState< Message[]>([]);

  const  [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useImmer< Message[]>([])

  const [subscribedTopics, setSubscribedTopics] = useState([]);
  // const [subscribedTopics, setSubscribedTopics] = useImmer([]);

  // const [currentUser, setCurrentUser] = useState<User | null>();
  const currentUser = useData();

  const [receiver, setReceiver] = useState<string>(""); // Sử dụng useState cho receiver

  const [username, setUsername] = useState<string>("");

  const [adminDefault, setAdminDefault] = useState<User | undefined>();

  // const [adminDefaultNew, setAdminDefaultNew] = useState<User | undefined>();

  const [usernameFormUrl, setUsernameFormUrl] = useState<string>("");
  
  const [ownerCurrent, setOwnerCurrent] = useState<User | undefined | null>();

  const [isConnected, setIsConnected] = useState(false); // Thêm trạng thái theo dõi kết nối STOMP

  const [currentTopic, setCurrentTopic] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  const [dataMessageTemporary, setDataMessageTemporary] = useState<dataMess | null>(null);

  // const stompClient = useRef(null);
  const stompClient = useRef<CompatClient | null>(null); // Khai báo đúng kiểu

  const path = useSearchParams();

    console.log('chatListCurrentUserByDMM>>>>>>>>>>>', chatListCurrentUserByDMM);
  console.log('chatListCurrentUserByDMM============================', chatListCurrentUserByDMM);
  

  useEffect(() => {
    const encodedStatus = path.get("status");
    if (encodedStatus) {
      if (encodedStatus === "default") {
        // nếu là default thì mở sẳn admin có sẵn
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
          // toast.success('ssasa '+decodedUsername )
        } catch (error) {
          console.error("Lỗi khi giải mã username:", error);
          setUsernameFormUrl(""); // Reset nếu giải mã thất bại
        }
      }
    } else {
      setUsernameFormUrl(""); // Reset nếu không có tham số
    }
  }, [path]); // Chạy lại mỗi khi searchParams thay đổi
  

  ////
  const rolePriority = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_OWNER", "ROLE_USER"];
  const getHighestRole = (user: User) => {
    if (!user || !user.authorities) return null;
    const userRoles = user.authorities.map((auth) => auth.role.name);
    return userRoles.sort(
      (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b)
    )[0];
  };
  // const [isExitingMy, setIsExitingMy] = useState<boolean>(true);

  // Cập nhật selectedChat khi adminDefault có sẵn
  useEffect(() => {
    if (
      isConnected &&
      adminDefault &&
      chatListCurrentUserByDMM.length === 0 &&
      selectedChat
      //  && selectedChat === ""
    ) {
      // console.log('vô effect========= 111111', isConnected, adminDefault, chatListCurrentUserByDMM, 'selected chat===', selectedChat);
      
      // console.log("Đã kết nối, gọi handleSelectChat với adminDefault...");
      handleSelectChat(adminDefault); // Chỉ gọi khi isConnected là true
    } else if (ownerCurrent) {

      console.log('vô effect========= 222222', isConnected, adminDefault, chatListCurrentUserByDMM, 'selected chat===', selectedChat);

      // toast.success('ownerCurrent chạy bào dây '+ ownerCurrent?.username)
      handleSelectChat(ownerCurrent);
      
      setShowChatList(true); //nếu true thì thực hiện mở form chat
      mutate(); // 
      mutateByReceiverUsernameOrCurrentUser();
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

  const defaultUser: User = {
    username: "Unknown",
    fullname: "Anonymous",
    password: "",
    enabled: 1,
    createdAt: new Date(),
    gender: null,
    birthday: null,
    email: "",
    avatar: null,
    authorities: [],
    addressUsers: [],
    phoneNumberUsers: [],
    wallet: { walletId: 0, balance: 0 },
  };
  
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
          //   const existingChatIndex = prevChats.findIndex(
          //     (item) => item?.user?.username === parsedMessage.sender
          //   );
          //   console.log('existingChatIndex =>>>' + existingChatIndex);


          //   if (existingChatIndex !== -1) {  // == 1 là đã tồn tại
          //     // Nếu chat đã tồn tại, tạo một bản sao và cập nhật nội dung
          //     const updatedChats = [...prevChats];
          //     updatedChats[existingChatIndex] = {
          //       ...updatedChats[existingChatIndex], // Giữ lại thông tin cũ
          //       content: parsedMessage.message || "", // Cập nhật nội dung
          //       // timestamp: new Date().toISOString(),
          //       createAt: new Date(), // Cập nhật thời gian
          //     };
          //     return updatedChats;
          //   } else {  // == -1 là chưa tồn tại
          //     // Nếu chat chưa tồn tại, thêm mới vào đầu danh sách

          //     // const newUser: User = {
          //     //   username: parsedMessage.sender || "Unknown",
          //     //   fullname: parsedMessage.senderFullName || "Anonymous",
          //     // };
          //     const newUser: Partial<User> = {
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
          // });
          
          setChatListCurrentUserByDMM((prevChats) => {
            const existingChatIndex = prevChats.findIndex(
              (item) => item.user?.username === parsedMessage.sender
            );

            if (existingChatIndex !== -1) {
              // Cập nhật nội dung nếu đã tồn tại
              const updatedChats = [...prevChats];
              updatedChats[existingChatIndex] = {
                ...updatedChats[existingChatIndex],
                content: parsedMessage.message || "",
                createAt: new Date(),
              };
              return updatedChats;
            } else {
              // Thêm mới nếu chưa tồn tại
              const newMessage: Message = {
                messageId: Date.now(),
                sender: { ...defaultUser, username: parsedMessage.sender, fullname: parsedMessage.senderFullName },
                receiver: { ...defaultUser }, // Tạm thời lấy `defaultUser` làm `receiver`
                content: parsedMessage.message || "",
                createAt: new Date(),
                isDelete: false,
                user: { ...defaultUser, username: parsedMessage.sender, fullname: parsedMessage.senderFullName },
              };
              return [newMessage, ...prevChats];
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

  const handleKeyEnter = (event: React.KeyboardEvent, content:string) => {
    // console.log('content=========>', content);
    
    if (!isString(content)||!content) {
      return;
    }
    // if (event.key === "Enter") {
    // console.log('content=========>', content);

      handleSendMessage(content);
    // }

    // khong lien quan den fect
    // mutate(); // 
    // mutateByReceiverUsernameOrCurrentUser();
  };

  interface dataMess {
    content: string;
    username: string;
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);


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

  const handleSendMessage = (_content: string) => {
    // console.log("content ++++++ ",inputRef.current);
    // console.log("_content ++++++>>>>>>>> ",_content);

    let contentStr: string = _content;
    if( !_content ||!isString(_content)){
      if (inputRef.current) {
        contentStr = inputRef.current.value
      }
      
    }

    console.log("_content ++++++>>>>>>>> ",_content);
    console.log("contentStr ++++++>>>>>>>> ",contentStr);
    console.log("isString(_content) ++++++>>>>>>>> ",isString(_content));

    if (
      contentStr.trim() !== "" &&
      stompClient.current &&
      stompClient.current.connected
    ) {
      const newMessage = {
        sender: currentUser?.username, // Tên người gửi
        receiver: receiver, // Tên người nhận
        content: `${contentStr}/SENDER=${currentUser?.username}-RECEIVER=${receiver}`,
        createdAt: new Date(),
      } ;
    
      // const newMessage: Message = {
      //   messageId: Date.now(), // Tạm dùng timestamp làm ID duy nhất
      //   sender: { ...defaultUser, username: currentUser?.username || "Unknown" }, // Cần đảm bảo kiểu `User`
      //   receiver: { ...defaultUser, username: receiver }, // Cần đảm bảo kiểu `User`
      //   content: `${contentStr}/SENDER=${currentUser?.username}-RECEIVER=${receiver}`,
      //   createAt: new Date(),
      //   isDelete: false,
      //   user: { ...defaultUser, username: currentUser?.username || "Unknown" }, // Cần đảm bảo kiểu `User`
      // };
      
      console.log("Đang gửi tin nhắn");
      console.log("newMessage ", JSON.stringify(newMessage));

      // Sắp xếp tên người gửi và người nhận theo thứ tự alphabet
      const sortedUsers = [currentUser?.username, receiver].sort();
      const topic = `/app/chat.sendMessage/${sortedUsers[0]}-${sortedUsers[1]}`;

      console.log("topic ", topic);

      // Gửi tin nhắn đến topic chung
      stompClient.current.send(topic, {}, JSON.stringify(newMessage));
      console.log('newMessage.receiver.username =>>>>>>>>>>>>>> ',newMessage.receiver);
      console.log('newMessage.sender.username =>>>>>>>>>>>>>> ',newMessage.sender);
      
      if (
        // newMessage.receiver.username === currentUser?.username || newMessage.sender.username === currentUser?.username
        newMessage.receiver=== currentUser?.username || newMessage.sender === currentUser?.username
      ) {
        console.log("khong them");
      } else {
        setChatListRealTime((prevMessages) => [...prevMessages, newMessage]);
      }
      // Cập nhật danh sách tin nhắn
      console.log("chat list mớ: ", chatListRealTime);

      // setInputMessage(""); // Xóa input sau khi gửi

      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }
  };
  // Hàm fetch dữ liệu messages
  
  const handleSelectChat = (chat: User) => {
    if (!checkLogin()) {
      return;
    }
  
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  
    console.log("Đã vào với: ", chat?.username || "Không có tên");
  
    setReceiver(chat?.username);
    console.log("Người nhận là ", chat?.username);
  
    setSelectedChat(chat);

    setChatListCurrentUserByDMM((draft)=>{

  //

      const isChatExists = draft.some(
            (item) => item?.user?.username === chat.username
          );
          if (!isChatExists) {
            return [
              ...draft,
              {
                user: chat,
                content: "Chat để được hỗ trợ",
                // timestamp: new Date().toISOString(),
                createAt: new Date(),
              },
            ];
          }
          return draft;

    });
    
  
    // setChatListCurrentUserByDMM((prevChats) => {
    //   const isChatExists = prevChats.some(
    //     (item) => item?.user?.username === chat.username
    //   );
    //   if (!isChatExists) {
    //     return [
    //       ...prevChats,
    //       {
    //         user: chat,
    //         content: "Chat để được hỗ trợ",
    //         // timestamp: new Date().toISOString(),
    //         createAt: new Date(),
    //       },
    //     ];
    //   }
    //   return prevChats;
    // });
   
    // setChatListCurrentUserByDMM((prevChats) => {
    //   const isChatExists = prevChats.some(
    //     (item) => item?.user?.username === chat.username
    //   );
    //   if (!isChatExists) {
    //     const defaultMessage: Message = {
    //       messageId: Date.now(), // Tạm thời sử dụng timestamp làm ID
    //       sender: { ...defaultUser, username: currentUser?.username || "Unknown" },
    //       receiver: { ...defaultUser, username: chat?.username, fullname: chat?.fullname || "Unknown" },
    //       content: "Chat để được hỗ trợ",
    //       createAt: new Date(),
    //       isDelete: false,
    //       user: { ...defaultUser, username: chat.username, fullname: chat.fullname || "Unknown" },
    //     };
    //     return [...prevChats, defaultMessage];
    //   }
    //   return prevChats;
    // });

    if (chatListCurrentUserByDMM.length === 0 && adminDefault) {
      setShowChat(true);
    } else if (chatListCurrentUserByDMM.length === 0) {
      setShowChat(false);
    } else {
      setShowChat(true);
    }
  
    if (ownerCurrent) {
      console.log("ownerCurrent dddddd", ownerCurrent);
  
      setShowChat(true);
  
      const newParams = new URLSearchParams(path);
      newParams.delete("status");
  
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newParams.toString()}`
      );
    }
  
    const sortedUsers = [currentUser?.username, chat.username].sort();
    const topic = `/topic/public/${sortedUsers[0]}-${sortedUsers[1]}`;
    setCurrentTopic(`${sortedUsers[0]}-${sortedUsers[1]}`);
  
    if (!subscribedTopics.includes(topic)) {
      if (stompClient.current && stompClient.current.connected) {
      
      
      stompClient.current?.subscribe(topic, (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message: ", receivedMessage);
  
        let msgTopic = "";
        const arrDestination = message.headers.destination.split("/");
        if (arrDestination.length > 0) {
          msgTopic = arrDestination[arrDestination.length - 1];
        }
  
        receivedMessage["topic"] = msgTopic;
        receivedMessage["tempReceiver"] = receivedMessage.receiver;
        receivedMessage["tempSender"] = receivedMessage.sender;
  
        if (
          (receivedMessage.receiver === currentUser?.username &&
            receivedMessage.sender === chat?.username) ||
          (receivedMessage.receiver === chat?.username &&
            receivedMessage.sender === currentUser?.username)
        ) {
          setChatListRealTime((prevMessages) => [...prevMessages, receivedMessage]);
          setDataMessageTemporary({
            content: receivedMessage.content,
            username: chat?.username,
          });
          
          setChatListCurrentUserByDMM((draft) => {
            const foundUser = draft.find(
              (item) => item?.user?.username === chat?.username)
            if (foundUser) {
              foundUser.content = receivedMessage.content
            }
            return draft;
          })
         
        }
      });
  
      setSubscribedTopics((prevTopics) => [...prevTopics, topic]);
      // setSubscribedTopics((df)=>{
      //   df.push(topic)
      //   return df;
      // })
    
  
    if (ownerCurrent) {
      setOwnerCurrent(null); // Reset sau khi tất cả các logic được xử lý
    }}
  
  }};

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
    fetchMessages,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );



  useEffect(() => {
    if (dataByReceiverUsernameOrCurrentUser) {
      // Nhóm các tin nhắn theo người gửi hoặc người nhận
      // let foundMyntd = false;
      // let tempAdminDefault = null;

      // let groupedMessages = []
      const groupedMessages = dataByReceiverUsernameOrCurrentUser.reduce(
        (acc, message) => {
          const username =
            message.receiver.username === currentUser?.username
              ? message.sender.username
              : message.receiver.username;

          // Check if username is "myntd" (either sender or receiver)
          // if (
          //   message.sender.username === "myntd" ||
          //   message.receiver.username === "myntd"
          // ) {
          //   // toast.info("User myntd có xuất hiện ở hội thoại");
          //   foundMyntd = true;
          //   setIsExitingMy(false);
          // } 
          
          // else if (!tempAdminDefault) {
          //   // toast.info("không có");

          //   tempAdminDefault = adminDefault;
          //   // toast.info('s111111111111111111111' +tempAdminDefault)
          //   // toast.info('sasssssss'+ adminDefault);
          //   // console.log('dsddddddddddddd lúc này tooinf tại chưa  '+ adminDefault?.username);

          //   // toast.info('sdsddd '+adminDefault )
          // }
          // if (!foundMyntd) {
          //   // setIsExitingMy(true);
          //   setAdminDefault(tempAdminDefault);
          //   // setIsExitingMyAdminDefault(true); // Chỉ hiển thị admin nếu không có "myntd"
          //   setChatListCurrentUserByDMM((prevChats) => {    
          //       return [
          //         ...prevChats,
          //         {
          //           user: dataAdmin,
          //           content: "Chat admin nhé dddd em",
          //           timestamp: new Date().toISOString(),
          //         },
          //       ];

          //   });
          // }
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

      const foundMessage = dataByReceiverUsernameOrCurrentUser.find((message)=>message.sender.username === "myntd" ||
      message.receiver.username === "myntd") 

      console.log('groupedMessages======>', groupedMessages);
    
      const groupedMessagesArray = Object.values(groupedMessages);

      if (!foundMessage) {
        groupedMessagesArray.push({
          user: dataAdmin,
          content: "Chat với admin nhé bạn ơi!",
          timestamp: new Date().toISOString(),
        })
      }

      
      // setChatListCurrentUserByDMM(groupedMessagesArray);

      // const isFound = chatListCurrentUserByDMM.find((item)=>item?.user?.username === dataAdmin)

      console.log('chatlissttttttttttt', chatListCurrentUserByDMM)
      console.log('groupedMessagesArray=============', groupedMessagesArray)
      console.log('dataAdmin=============', dataAdmin)

      // setChatListCurrentUserByDMM((prevChats) => {
      //   const isAdminExists = [...prevChats, ...groupedMessagesArray].some(

      //     (item) => item?.user?.username === dataAdmin?.username  // myntd
      //   ); 
  
      //   const updatedChats = isAdminExists ? [...groupedMessagesArray]: 
      //   [
      //         ...groupedMessagesArray,
      //         {
      //           user: dataAdmin,
      //           content: "Chat admin nhé bạn ơi",
      //           timestamp: new Date().toISOString(),
      //         },
      //       ];
  
      //   console.log("groupedMessagesArray:", JSON.stringify(groupedMessagesArray, null, 2));
      //   console.log("updatedChats:", JSON.stringify(updatedChats, null, 2));
      //   return updatedChats;
      // });
      setChatListCurrentUserByDMM(groupedMessagesArray);
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

  // useEffect(() => {
  //   console.log("Danh sách chat đã cập nhật: ", chatListCurrentUserByDMM);
  //   console.log("Admin mặc định: ", adminDefault);
  //   console.log("isExitingMy: ", isExitingMy);
  // }, [chatListCurrentUserByDMM, adminDefault, isExitingMy]);
  // useEffect(() => {
  //   console.log(
  //     "Danh sách chat real-time đã được cập nhật: dmdmdmdmdmdmdm",
  //     chatListCurrentUserByDMM
  //   );
  // }, [chatListCurrentUserByDMM, adminDefault, isExitingMy]);

  useEffect(() => {
    if (data) {
      const tempData = data.map((item) => {
        const sortedUsers = [
          item.receiver.username,
          item.sender.username,
        ].sort();
        return {
          ...item,
          topic: `${sortedUsers[0]}-${sortedUsers[1]}`,
        };
      });
      setChatListRealTime(tempData);
      console.error("chat list: ", chatListRealTime);
    } //               mới
  }, [data]);


  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/chat_page") {
      setShowChatIcon(false);
    } else {
      setShowChatIcon(true);
    }
  }, []);

  useEffect(() => {
    console.log("setSelectedChat: ", selectedChat);
  }, [selectedChat]);

  // const handleChatToggle = () => {
  //   setShowChat(!showChat);
  //   if (adminDefault) {
  //     handleSelectChat(adminDefault);
  //   }
  // };

  const handleToggle = () => {
    setShowChat(false);
  };

  // const handleChatAutoTrue = (chat: User) => {
  //   setShowChat(true); //nếu true thì thực hiện mở form chat
  //   handleSelectChat(chat);
  // };

  const handleChatListToggle = () => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để sử dụng chat");
    } else {
      setShowChatList(!showChatList); //nếu true thì thực hiện mở form chat
      mutate(); // 
      mutateByReceiverUsernameOrCurrentUser();
    }
  };

  const handleMaximizeToggle = () => {
    setIsMaximized(!isMaximized); // nếu true thì thực hiện thu nhỏ
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized); // nếu true thì thực hiện phóng to
  };

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const filteredChatList = chatListCurrentUserByDMM.filter((chatGroup) =>
    // chatGroup?.user?.username.toLowerCase().includes(searchKeyword.toLowerCase()))
  removeVietnameseTones(chatGroup?.user?.username.toLowerCase()).includes(
    removeVietnameseTones(searchKeyword.toLowerCase())));
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
                        chatGroup.user?.username !== currentUser?.username  ? chatGroup.user : null;
                        const isActive = selectedChat?.username === chatUser?.username;

                      if (!chatUser) return null;
                      // console.log('sssssssss ',chatUser);
                      // console.log('chat group time ', formatTime(chatGroup.timestamp));
                      return (
                        <ListGroup.Item
                          key={chatUser?.username || index}
                          onClick={() => handleSelectChat(chatUser)}
                          // className="d-flex flex-column"
                          className={`d-flex flex-column ${isActive ? 'active-chat' : ''}`}  // Thêm class 'active-chat' nếu mục được chọn

                        >
                          <div className="d-flex align-items-center ">
                          {/* <div className={`d-flex align-items-center  ${isActive ? 'active-link' : ''}`}> */}
                            <img
                              src={
                                chatUser?.avatar
                                  ? chatUser.avatar
                                  : "/chat_page/assets/images/users/user-5.png"
                              }
                              alt={chatUser?.username || "Không có tên"}
                              style={{
                                width: "40px",
                                height: "40px",
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
                              {dataMessageTemporary === null ? chatGroup.content 
                                : chatUser.username === dataMessageTemporary.username ? 
                                dataMessageTemporary.content 
                                : chatGroup.content}
                              {/* {chatGroup.content || "Không có nội dung"} */}
                            </p>
                            {/* <p className="col text-end"> {formatTime(chatGroup.timestamp)}</p> */}
                          </div>
                        </ListGroup.Item>
                      );
                    })
                  ) :
                  null
                  }
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
                            (itemMessage.tempReceiver  ===
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
                          </div>
                        );
                      })}
                  </div>

                  {/* Phần nhập liệu và nút gửi */}
                  <div className="card-footer d-flex p-2">
                    {/* <Form.Control
                      ref={inputRef}
                      type="text"
                      placeholder="Nhập câu hỏi tiếp theo của bạn"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyEnter} // sự kiện key down
                      className="me-2"
                    /> */}
                   
                    <InputChat  
                    inputRef={inputRef}
                    handleKeyEnter={handleKeyEnter}
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
