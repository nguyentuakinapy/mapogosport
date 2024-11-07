package mapogo.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import mapogo.entity.Message;
import mapogo.service.MessageService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/send")
    public void sendMessage(Message message) {
        // Lưu tin nhắn vào cơ sở dữ liệu
    	System.err.println("message được gửi "+message);

        messageService.saveMessage(message);
        
//        // Gửi tin nhắn đến người nhận
//        messagingTemplate.convertAndSend("/topic/messages/" + message.getReceiver().getUsername(), message);
        
        // Gửi tin nhắn đến người nhận theo topic dựa trên username
        String topic = "/topic/chat/" + message.getSender().getUsername() + "-" + message.getReceiver().getUsername();
        messagingTemplate.convertAndSend(topic, message);
    }
}
