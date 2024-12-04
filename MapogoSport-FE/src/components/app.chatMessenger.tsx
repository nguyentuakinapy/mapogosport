"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Đảm bảo đã cài đặt Bootstrap Icons
import axios from "axios";
import useSWR from "swr";
import "../app/globals.css";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useData } from "@/app/context/UserContext";
import { removeVietnameseTones } from './Utils/Format';
import { toast } from "react-toastify";
import InputChat from "./InputChat/InputChat";
import { cloneDeep, isString} from "lodash";
import { useImmer } from "use-immer";
import Image from "next/image";



export default function ChatBox() {

  interface User {
    username: string;
    fullname: string;
    password: string;
    email: string;
    avatar: string | null;
    authorities: Authorities[];
}
  interface Message {
    messageId: number;
    sender: User |string;
    receiver: User|string ;
    content: string;
    createdAt: Date;
    isDelete: boolean;
    user?: User;
    tempReceiver?:string
    tempSender?:string
    topic?:string
    isAdd?:boolean
    isOwner?:boolean
  }

  interface Message2 {
    messageId: number;
    sender: User ;
    receiver: User ;
    content: string;
    createdAt: Date;
    isDelete: boolean;
    user?: User;
    tempReceiver?:string
    tempSender?:string
    topic?:string
    isAdd?:boolean
    isOwner?:boolean
  }

 

  interface GroupedMessage {
    messageId?: number;
    sender?: User | string;
    receiver?: User | string;
    content?: string;
    createdAt?: Date;
    isDelete?: boolean;
    user?: User;
    tempReceiver?:string
    tempSender?:string
    topic?:string
    isAdd?:boolean
    isOwner?:boolean
  }

  interface GroupedMessage2 {
    user?: User;
    content: string;
    createdAt: Date;
    tempReceiver?:string
    tempSender?:string
    topic?:string
    isAdd?:boolean
    isOwner?:boolean
  }



  

  const [showChat, setShowChat] = useState(false); // quản lý việc hiển thị chat form
  const [showChatList, setShowChatList] = useState(false); // quản lý việc hiển thị chat form
  const [showChatIcon, setShowChatIcon] = useState(true); // quản lý việc hiển thị icon chat
  const [isMinimized, setIsMinimized] = useState(false); // quản lý trạng thái thu nhỏ của chat form
  const [isMaximized, setIsMaximized] = useState(false); // quản lý trạng thái phóng to của chat form
  const [selectedChat, setSelectedChat] = useState<User>(); // Quản lý cuộc trò chuyện đang được chọn
  // const [inputMessage, setInputMessage] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat

  // const [chatListRealTime, setChatListRealTime] = useState<Message2[]>([]);
  const [chatListRealTime, setChatListRealTime] = useState<Message[]>([]);
  // const [chatListCurrentUser, setChatListCurrentUser] = useState<Message[]>([]);
  // const [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useState< Message[]>([]);

  // const  [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useImmer< Message[]>([])
  const  [chatListCurrentUserByDMM, setChatListCurrentUserByDMM] = useImmer< GroupedMessage[]>([])

  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  // const [subscribedTopics, setSubscribedTopics] = useImmer([]);

  // const [currentUser, setCurrentUser] = useState<User | null>();
  const currentUser = useData();
  const [receiver, setReceiver] = useState<string>(""); // Sử dụng useState cho receiver
  const [username, setUsername] = useState<string>("");
  const [adminDefault, setAdminDefault] = useState<User | undefined>();
  const [usernameFormUrl, setUsernameFormUrl] = useState<string>("");
  const [ownerCurrent, setOwnerCurrent] = useState<User | undefined | null>();
  const [isConnected, setIsConnected] = useState(false); // Thêm trạng thái theo dõi kết nối STOMP
  const [currentTopic, setCurrentTopic] = useState(""); // lưu trữ nội dung người dùng đang nhập vào ô chat
  const [dataMessageTemporary, setDataMessageTemporary] = useState<dataMess | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const stompClient = useRef<CompatClient | null>(null); // Khai báo đúng kiểu

  let path;

  if (typeof window !== 'undefined') {
    path = window.location.href
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      if (typeof window !== "undefined" && params) {
        const encodedStatus = params.get("status");

        if (encodedStatus) {
          if (encodedStatus === "default") {
            // nếu là default thì mở sẳn admin có sẵn
            if (adminDefault) {
              handleSelectChat(adminDefault);
              handleChatListToggle()
              params.delete("status");

              const newParams = new URLSearchParams(window.location.search);
              newParams.delete("status");
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}`
              );
            }
          } else {
            try {
              const decodedUsername = atob(encodedStatus);
              setUsernameFormUrl(decodedUsername);
            } catch (error) {
              setUsernameFormUrl(""); // Reset nếu giải mã thất bại
            }
          }
        } else {
          setUsernameFormUrl(""); // Reset nếu không có tham số
        }
      }
    }

  }, [path]); // Chạy lại mỗi khi searchParams thay đổi


  const rolePriority = ["ROLE_ADMIN", "ROLE_STAFF", "ROLE_OWNER", "ROLE_USER"];
  const getHighestRole = (user: User) => {
    if (!user || !user.authorities) return null;
    const userRoles = user.authorities.map((auth) => auth.role.name);
    return userRoles.sort(
      (a, b) => rolePriority.indexOf(a) - rolePriority.indexOf(b)
    )[0];
  };

  // Cập nhật selectedChat khi adminDefault có sẵn
  useEffect(() => {
    if (isConnected && adminDefault && chatListCurrentUserByDMM.length === 0 && selectedChat) {
      handleSelectChat(adminDefault); // không chạy được
    } else if (ownerCurrent) {
      handleSelectChat(ownerCurrent);
      setShowChatList(true); //nếu true thì thực hiện mở form chat
      mutate(); // 
      mutateByReceiverUsernameOrCurrentUser();
    }
  }, [
    // isConnected,
    // adminDefault,
    // chatListCurrentUserByDMM,
    // selectedChat,
    ownerCurrent,
    usernameFormUrl,
  ]);

  // Xử lý kiểm tra quyền và thiết lập username nếu cần
  useEffect(() => {
    if (currentUser) {
      const highestRole = getHighestRole(currentUser);
      if ((highestRole === "ROLE_USER" || highestRole === "ROLE_OWNER" || highestRole === "ROLE_STAFF") && chatListCurrentUserByDMM.length === 0) {
        setUsername("myntd");
      } else {
        setAdminDefault(dataAdmin);
      }
    }
  }, [currentUser, chatListCurrentUserByDMM, username]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: dataFindById } = useSWR<User>(username && `${BASE_URL}rest/user/${username}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: dataAdmin } = useSWR<User>(`${BASE_URL}rest/user/myntd`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: dataFindByIdOwner } = useSWR<User>(usernameFormUrl ? `${BASE_URL}rest/user/${usernameFormUrl}` : null, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

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

  const defaultUser: User = {
    username: "Unknown",
    fullname: "Anonymous",
    password: "",
    email: "",
    avatar: null,
    authorities: [],
  };

  useEffect(() => {
    if (!currentUser) return;
    // Khởi tạo kết nối STOMP với WebSocket server
    const socket = new SockJS(`${BASE_URL}ws`); // 1. kết nối server
    stompClient.current = Stomp.over(socket);

    // Kết nối tới server STOMP
    stompClient.current.connect(
      {},
      () => {
        setIsConnected(true); // Đánh dấu kết nối STOMP thành công

        // topic cho nhận thông báo
        const topicDefault = `/topic/notify/${currentUser?.username}`;
        stompClient.current?.subscribe(topicDefault, (message) => {
          const parsedMessage = JSON.parse(message.body);
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
                createdAt: new Date(),
              };
              return updatedChats;
            } else {
              // Thêm mới nếu chưa tồn tại
              const newMessage: Message = {
                messageId: Date.now(),
                sender: { ...defaultUser, username: parsedMessage.sender, fullname: parsedMessage.senderFullName },
                receiver: { ...defaultUser }, // Tạm thời lấy `defaultUser` làm `receiver`
                content: parsedMessage.message || "",
                createdAt: new Date(),
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
          console.log("createdAt:", parsedMessage.createdAt);
        });
      }, () => { setIsConnected(false); });
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

  const handleKeyEnter = (event: React.KeyboardEvent, content: string) => {
    if (!isString(content) || !content) {
      return;
    }

    handleSendMessage(content);
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
      });
      mutate;
      mutateByReceiverUsernameOrCurrentUser;
    }
  }, [chatListRealTime]); // Theo dõi sự thay đổi của danh sách tin nhắn

  const handleSendMessage = (_content: string) => {
    let contentStr: string = _content;
    if (!_content || !isString(_content)) {
      if (inputRef.current) {
        contentStr = inputRef.current.value
      }
    }

    console.log("_content ++++++>>>>>>>> ",_content);
    console.log("contentStr ++++++>>>>>>>> ",contentStr);
    console.log("isString(_content) ++++++>>>>>>>> ",isString(_content));

    if ( contentStr.trim() !== "" && stompClient.current && stompClient.current.connected) {
       const newMessage = {
        messageId: 0,
        sender: currentUser?.username ?? "NOOOOO", // Tên người gửi
        receiver: receiver, // Tên người nhận
        content: `${contentStr}/SENDER=${currentUser?.username}-RECEIVER=${receiver}`,
        createdAt: new Date(),
        isDelete: false,
      };
      
      console.log("Đang gửi tin nhắn");
      console.log("newMessage ", JSON.stringify(newMessage));

      // Sắp xếp tên người gửi và người nhận theo thứ tự alphabet
      const sortedUsers = [currentUser?.username, receiver].sort();
      const topic = `/app/chat.sendMessage/${sortedUsers[0]}-${sortedUsers[1]}`;

      // Gửi tin nhắn đến topic chung
      stompClient.current.send(topic, {}, JSON.stringify(newMessage));

      if (newMessage.receiver !== currentUser?.username || newMessage.sender !== currentUser?.username) {
        setChatListRealTime((prevMessages) => [...prevMessages, newMessage]);
      }
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

    setSelectedChat(chat);

  
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  
    console.log("Đã vào với: ", chat?.username || "Không có tên");
    console.log("chatListCurrentUserByDMM: ", chatListCurrentUserByDMM);
  
    // setReceiver(chat?.username);
    // console.log("Người nhận là ", chat?.username);
  
    // setSelectedChat(chat);


    // const foundMessageInGrouped = dataByReceiverUsernameOrCurrentUser.find((message)=>message.sender.username === "myntd" ||
    // message.receiver.username === "myntd") 

    // console.log('chatListCurrentUserByDMM+++++++++++++', chatListCurrentUserByDMM);

    setChatListCurrentUserByDMM((draft) => {

      const tempArr = cloneDeep(draft)

      const foundMessageInState = draft.find((message)=>message?.user?.username === "myntd") 

      if (!foundMessageInState) {
        tempArr.push({
          user: dataAdmin,
          content: "Chat với admin nhé bạn ơi!",
          createdAt: new Date(),
          isAdd: true,
        })
      }

      const isChatExists = tempArr.some(
            (item) => item?.user?.username === chat.username
          );
    console.log("isChatExists: ", isChatExists);

          if (!isChatExists) {
            tempArr.push({
            user: chat,
            content: "Chat để được hỗ trợ",
            createdAt: new Date(),
            isAdd: true,
            isOwner: true,
          }
          )
            
          }
    console.log("tempArrtempArrtempArrtempArr: ", tempArr);

          return  tempArr

    });

    setReceiver(chat?.username);
    console.log("Người nhận là ", chat?.username);
  
    if (chatListCurrentUserByDMM.length === 0 && adminDefault) {
      setShowChat(true);
    } else if (chatListCurrentUserByDMM.length === 0) {
      setShowChat(false);
    } else {
      setShowChat(true);
    }

    if (ownerCurrent) {
      setShowChat(true);

      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}`
      );
    }

    const sortedUsers = [currentUser?.username, chat.username].sort();
    const topic = `/topic/public/${sortedUsers[0]}-${sortedUsers[1]}`;
    setCurrentTopic(`${sortedUsers[0]}-${sortedUsers[1]}`);

    if (!subscribedTopics.includes(topic)) {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current?.subscribe(topic, (message) => {
          const receivedMessage = JSON.parse(message.body);

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

        if (ownerCurrent) {
          setOwnerCurrent(null); // Reset sau khi tất cả các logic được xử lý
        }
      }

    }
    
  };

  //////

  const fetchMessages = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  };

  // Sử dụng useSWR để fetch messages
  const { data, isLoading, error, mutate } = useSWR <Message2[]>(
    currentUser && receiver
      ? `${BASE_URL}api/messages/${currentUser.username}/${receiver}`
      : null,
    fetchMessages
  );

  // get data dataByReceiverUsernameOrCurrentUser
  const {
    data: dataByReceiverUsernameOrCurrentUser,
    mutate: mutateByReceiverUsernameOrCurrentUser,

  } = useSWR(
    currentUser
      ? `${BASE_URL}api/messages/receiver/${currentUser.username}`
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
      const groupedMessages = dataByReceiverUsernameOrCurrentUser.reduce(
        (acc:  { [username: string]: GroupedMessage2 }, message: Message2) => {
          const username =
            message.receiver.username === currentUser?.username
              ? message.sender.username
              : message.receiver.username;

          // Check if username is "myntd" (either sender or receiver)
          if (!acc[username]) {
            acc[username] = {
              user: message.receiver.username === currentUser?.username ? message.sender : message.receiver,
              content: message.content,
              createdAt: message.createdAt,
            };
          } else if (
            new Date(message.createdAt) > new Date(acc[username].createdAt)
          ) {
            // Nếu đã có tin nhắn từ người dùng này, chỉ cập nhật nếu tin nhắn mới hơn
            acc[username].content = message.content;
            acc[username].createdAt = message.createdAt;
          }
          return acc;
        },
        {}
      );

      let groupedMessagesArray = Object.values(groupedMessages);

      console.log('chatlissttttttttttt', chatListCurrentUserByDMM)
      console.log('groupedMessagesArray=============', groupedMessagesArray)
      console.log('dataAdmin=============', dataAdmin)
      setChatListCurrentUserByDMM((draft)=>{
        const tempArr =cloneDeep(draft); // tạo một biến tempArr để lấy giá trị của State gốc chatListCurrentDDM nhưng không lấy địa chỉ
      const arrIsAdds = cloneDeep(tempArr.filter((item)=>item.isAdd)) 
      if (groupedMessagesArray.length>0) {
        if (arrIsAdds.length>0) {
          for (let k = 0; k < groupedMessagesArray.length; k++) {
            const mess = groupedMessagesArray[k] as GroupedMessage;
            for (let i = 0; i < arrIsAdds.length; i++) {
              const addedItem = arrIsAdds[i];
              if (addedItem.user?.username === mess.user?.username) {
                const foundIndex = tempArr.findIndex((message)=>message.user?.username === addedItem.user?.username && message.isAdd)
                if (foundIndex>=0) {
                  tempArr.splice(foundIndex,1)
                  arrIsAdds.splice(i,1)
                  break;
                }
              }
            }
          }
          groupedMessagesArray = [...arrIsAdds,...groupedMessagesArray]
        }
      }else{
        if (tempArr.length>0) {
          groupedMessagesArray = cloneDeep(tempArr)
        }else{
          groupedMessagesArray = [
            {
              user: dataAdmin,
              content: "Chat với admin nhé bạn ơi!",
              createdAt: new Date().toISOString(),
              isAdd: true,
            }
          ]
        }
      }
      
        return groupedMessagesArray
      });
      // mới thêm 19/11

      console.log('ownerCurrent=======', ownerCurrent);
      console.log('groupedMessagesArray=======', groupedMessagesArray);
    

      console.log("Danh sách chat real-time đã nhóm: ", groupedMessagesArray);
      console.log(
        "Danh sách setChatListCurrentUserByDMM: ",
        chatListCurrentUserByDMM
      );
    }
  }, [dataByReceiverUsernameOrCurrentUser]);
  
  const formatTime = (createdAt: Date | string) => {
    const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
    if (isNaN(date.getTime())) return "Invalid Date";
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Sử dụng định dạng 24 giờ
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
  
    const time = date.toLocaleTimeString("vi-VN", timeOptions); // Lấy giờ và phút
    const day = date.toLocaleDateString("vi-VN", dateOptions); // Lấy ngày, tháng, năm
  
    return `${time} - ${day}`; // Ghép giờ và ngày bằng dấu "-"
  };
  
  
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

  const handleToggle = () => {
    setShowChat(false);
  };

  const handleChatListToggle = () => {
    if (!currentUser) {
      toast.warning("Vui lòng đăng nhập để sử dụng chat");
    } else {
      setShowChatList(!showChatList); //nếu true thì thực hiện mở form chat
      if(currentUser?.username !== dataAdmin?.username){
        if(showChatList === false){
          if(dataAdmin){
            handleSelectChat(dataAdmin);
          }
        }else{
          setShowChatList(!showChatList); 
        }
      }
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

  const filteredChatList = chatListCurrentUserByDMM.filter((chatGroup) => {
    if (!chatGroup?.user?.username) {
      return false; 
    }
    console.log('chat group =>>>>> ',chatGroup)
    const username = chatGroup.user.username;
    return removeVietnameseTones(username.toLowerCase()).includes(
      removeVietnameseTones(searchKeyword.toLowerCase())
    );
  });
  
  // console.log("receiver====>", receiver);
  // console.log("current topic====>", currentTopic);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // console.log('filteredChatList=======', filteredChatList);
  

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error loading messages.</p>;
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
              <Image src="/images/mail_giphy.webp" alt="Messenger" width={40} height={40}
                style={{ cursor: "pointer" }} unoptimized />
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
                      const isActive = selectedChat?.username === chatUser?.username;

                      if (!chatUser) return null;
                      // console.log('sssssssss ',chatUser);
                      // console.log('chat group time ', formatTime(chatGroup.createdAt));
                      return (
                        <ListGroup.Item
                          key={chatUser?.username || index}
                          onClick={() => handleSelectChat(chatUser)}
                          // className="d-flex flex-column"
                          className={`d-flex flex-column hover-chat ${isActive ? 'active-chat' : ''}`}  // Thêm class 'active-chat' nếu mục được chọn

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
                            <p className=" col text-start title-content-preview">
                              {dataMessageTemporary === null ? chatGroup.content 
                                : chatUser.username === dataMessageTemporary.username ? 
                                dataMessageTemporary.content 
                                : chatGroup.content}
                              {/* {chatGroup.content || "Không có nội dung"} */}
                            </p>
                            {/* <p className="col text-end"> {formatTime(chatGroup.createdAt)}</p> */}
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
                <Image width={30} height={17} src="/images/logo.png" alt="Chat Logo" className="me-2" />
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
                .filter((itemMessage) => {
                  const senderUsername =
                    typeof itemMessage.sender === "string"
                      ? itemMessage.sender
                      : itemMessage.sender?.username;

                  const receiverUsername =
                    typeof itemMessage.receiver === "string"
                      ? itemMessage.receiver
                      : itemMessage.receiver?.username;

                  return (
                    (receiverUsername ||
                      (itemMessage.tempReceiver === currentUser?.username && senderUsername) ||
                      itemMessage.tempSender === receiver || receiverUsername ||
                      (itemMessage.tempReceiver === receiver && senderUsername) ||
                      itemMessage.tempSender === currentUser?.username) &&
                    currentTopic === itemMessage.topic
                  );
                })
                .map((msg, index) => {
                  const senderUsername =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?.username;

                  return (
                    <div
                      key={msg.messageId || index}
                      className={`d-flex ${
                        senderUsername === currentUser?.username ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded mb-2`}
                        style={{
                          maxWidth: "80%",
                          backgroundColor:
                            senderUsername === currentUser?.username ? "#66c7ff" : "#f0f0f0",
                          color: "black",
                        }}
                      >
                        {msg.content}
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
                  <div className="card-footer d-flex align-items-center p-2 bg-transparent">
                    <Row className="w-100 ">
                      <Col sm={10} className="p-0">
                        <InputChat
                          inputRef={inputRef}
                          handleKeyEnter={handleKeyEnter}
                        />
                      </Col>
                      <Col sm={2} className="p-0 d-flex justify-content-end">
                        <Button
                          variant="light"
                          className="d-flex align-items-center justify-content-center"
                          onClick={() => handleSendMessage(inputRef.current?.value || "")}
                        >
                          <i className="bi bi-send-fill text-primary"></i>
                        </Button>
                      </Col>
                    </Row>
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
