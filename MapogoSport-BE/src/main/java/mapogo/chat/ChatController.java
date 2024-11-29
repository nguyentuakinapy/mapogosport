package mapogo.chat;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
//import com.example.websocketdemo.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import mapogo.dao.MessageDAO;
import mapogo.dao.NotificationDAO;
import mapogo.entity.Message;
import mapogo.entity.Notification;
import mapogo.entity.User;
import mapogo.service.EmailService;
import mapogo.service.UserService;
import mapogo.utils.ParseSenderAndReceiver;


@Controller
public class ChatController {
	@Autowired
	MessageDAO messageDAO;
	@Autowired
	EmailService emailService;
	@Autowired
	UserService userService;
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	@Autowired
	NotificationDAO notificationDAO;
	
	 
	

    @MessageMapping("/chat.sendMessage/{userSort_1}-{userSort_2}")
    @SendTo("/topic/public/{userSort_1}-{userSort_2}")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage,
                                   @DestinationVariable("userSort_1") String userSort_1,
                                   @DestinationVariable("userSort_2") String userSort_2) {
        
        // Kiểm tra tham số đã lấy được từ URL
        System.err.println("userSort_1: " + userSort_1);
        System.err.println("userSort_2: " + userSort_2);
        String input = chatMessage.getContent();
        
        Map<String, String> result = ParseSenderAndReceiver.parseSenderAndReceiver(input);
        String sender = result.get("SENDER");
        String receiver = result.get("RECEIVER");
        String originalMessage = result.get("OriginalMessage");
        
        System.out.println("SENDER: " + sender);
        System.out.println("RECEIVER: " + receiver);
        System.out.println("originalMessage: " + originalMessage);
        
        ChatMessage tempStr = chatMessage;
        tempStr.setContent(originalMessage);
        
        Message message = new Message();
        User u = new User();
        u.setUsername(sender);
                
        User ur = new User();
        ur.setUsername(receiver);
        
        message.setSender(u);
        message.setReceiver(ur);
        message.setContent(originalMessage);
        message.setIsDeleted(false);
        message.setCreatedAt(new Date());
        System.err.println("message: "+message.getSender().getUsername());
        
        
        System.err.println("setReceiver: "+message.getReceiver().getUsername());
        
        
        
        System.err.println("message: "+message.getIsDeleted());
        System.err.println("message: "+message.getCreatedAt());
        Map<String, String> payload = new HashMap<>();

     User senderUser = userService.findByUsername(sender);
     if (senderUser == null) {
         throw new RuntimeException("Sender not found: " + sender);
     }
     payload.put("sender", senderUser.getUsername());
     payload.put("senderFullName", senderUser.getFullname()); // Giả sử User có trường fullName

     User receiverUser = userService.findByUsername(receiver);
     if (receiverUser == null) {
         throw new RuntimeException("Receiver not found: " + receiver);
     }
     payload.put("receiver", receiverUser.getUsername());
     payload.put("receiverFullName", receiverUser.getFullname()); // Giả sử User có trường fullName

     payload.put("message", originalMessage);
     payload.put("timestamp", new Date().toString());

     Notification n = new Notification();
		n.setUser(receiverUser);
		n.setTitle("Thông báo tin nhắn mới từ/SENDER-"+ senderUser.getUsername());
		n.setMessage(senderUser.getFullname() + " vừa gửi tin cho bạn");
		n.setType("notifyMess");
		n.setBooking(null);
		notificationDAO.save(n);
     
     // Gửi Map qua WebSocket
     String topicNotify = "/topic/notify/" + receiver;
     messagingTemplate.convertAndSend(topicNotify, payload);
     System.out.println("Message payload sent to topic: " + payload);
     
     System.err.println("n.getUsername() "+ receiverUser.getUsername());
     messagingTemplate.convertAndSend("/topic/notification/username", receiverUser.getUsername());

        messageDAO.save(message);
        return tempStr;
    }


}
