package mapogo.chat;


import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
//import com.example.websocketdemo.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import mapogo.dao.MessageDAO;
import mapogo.entity.Message;
import mapogo.entity.User;
import mapogo.utils.ParseSenderAndReceiver;


@Controller
public class ChatController {
	@Autowired
	MessageDAO messageDAO;

//    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public/myntd-tanthanh")
//    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
//    	System.err.println("chatMessage :"+chatMessage.getContent());
//    	
//    	String strTemp = chatMessage.getContent();
////    	aaa/tanthanh/thanhtan/ksdjlfjsdjfl/klsdjflkjsdlkfjlsf
//    	String noidung = "aaa";
//    	ChatMessage temp = chatMessage;
//    	temp.setContent(noidung);
//    	
//    	System.err.println("chatMessage :"+chatMessage.getSender());
//        return temp;
////        return chatMessage;
//    }
	  // Thêm {sender}-{receiver} vào đường dẫn @MessageMapping
    @MessageMapping("/chat.sendMessage/{userSort_1}-{userSort_2}")
//    @SendTo("/topic/public/myntd-tanthanh")
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
        
        messageDAO.save(message);
        
        
        
        return tempStr;
    }

//    @MessageMapping("/chat.addUser")
//    @SendTo("/topic/public/myntd-tanthanh")
//    public ChatMessage addUser(@Payload ChatMessage chatMessage,
//                               SimpMessageHeaderAccessor headerAccessor) {
//        // Add username in web socket session
//        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
//        return chatMessage;
//    }

}
