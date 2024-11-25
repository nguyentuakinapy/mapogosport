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
import mapogo.entity.Message;
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
	
	public String bodyEmail(String sender, String tempStr) {
		
		  String body = String.format("""
			        <!DOCTYPE html>
			        <html lang="en">
			        <head>
			            <meta charset="UTF-8">
			            <meta name="viewport" content="width=device-width, initial-scale=1.0">
			            <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
			            <title>Email Template</title>
			            <style>
			            body{
			                    background-color: #fefefe;
			            }
			            
			                .email-container {
			                    max-width: 600px;
			                    margin: auto;
			                    padding: 20px;
			                    border: 1px solid #ddd;
			                    border-radius: 5px;
			                    font-family: Arial, sans-serif;
			                    background-color: #fff;
			                }
			                .email-header {
			                    text-align: center;
			                    padding-bottom: 5px;
			                }
			                .email-header img {
			                    max-width: 300px;
			                }
			                .email-content {
			                    text-align: left;
			                }
			                .email-content h2 {
			                    color: #333;
			                }
			                .email-footer {
			                    text-align: center;
			                    padding-top: 20px;
			                    font-size: 12px;
			                    color: #777;
			                }
			            </style>
			        </head>
			        <body>
			            <div class="email-container">
			                <div class="email-header">
			                    <img src="https://res.cloudinary.com/disnzpdvj/image/upload/v1732072868/logo_ixjedz.png" alt="Logo">
			                    <h2>MAPOGO SPORT</h2>
			                </div>
			                <div class="email-content">
			                    <p>Tin nhắn mới từ <strong>%s</strong></p>
			                    <p>Đây là tin mới nhất...</p>
			                    <ul>
			                        <li>Tung ra những voucher hời cho bạn!</li>
			                        <li>Thường xuyên cập nhật sân mới nhất</li>
			                        <li>Cá nhân hóa trải nghiệm</li>
			                    </ul>
			                    <p>Nội dung mới nhất là: <strong>%s</strong></p>
			                    <p>Best regards,<br>The Mapogo Sport Team</p>
			                </div>
			                <div class="email-footer">
			                    <p>123 Tân Chánh Hiệp, Thành phố Hồ Chí Minh, 7000</p>
			                    <p>&copy; 2024 Mapogo Sport. All rights reserved.</p>
			                </div>
			            </div>
			        </body>
			        </html>
	""", sender, tempStr);
		return body;
	}
	 
	

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
        
//        String emailByReceiver = userService.findByUsername(receiver).getEmail();
//        System.err.println("emailByReceiver "+ emailByReceiver);
//        if(emailByReceiver != "" && !emailByReceiver.isEmpty()) {
//        	String emailSubject = String.format("%s đã gửi tin nhắn cho bạn",sender);
//        	System.err.println("emailSubject " +emailSubject);
//        	String emailContent = bodyEmail(sender, originalMessage);
//          emailService.sendEmailOfQuocAnh(emailByReceiver, emailSubject, emailContent);
//        }else {
//        	System.err.println("không cần gửi mail");
//        }
     // Nội dung tin nhắn bạn muốn gửi
//	     Map<String, String> payload = new HashMap<>();
//	     payload.put("sender", sender);
//	     payload.put("message", originalMessage);
//	     payload.put("receiver", receiver);
//	     payload.put("timestamp", new Date().toString());
//        Message m = new Message();
//        User uS = new User(); 
//        uS = userService.findByUsername(sender);
//        User uR =  new User(); 
//        uR =userService.findByUsername(receiver);
//        
//        
//        m.setSender(uS);
//        m.setReceiver(uR);
//        m.setContent(originalMessage);
//        m.setIsDeleted(false);
//        m.setCreatedAt(new Date());
//        System.err.println("messs "+m);
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

     // Gửi Map qua WebSocket
     String topicNotify = "/topic/notify/" + receiver;
     messagingTemplate.convertAndSend(topicNotify, payload);

     System.out.println("Message payload sent to topic: " + payload);

        
	
        
        messageDAO.save(message);
        return tempStr;
    }


}
