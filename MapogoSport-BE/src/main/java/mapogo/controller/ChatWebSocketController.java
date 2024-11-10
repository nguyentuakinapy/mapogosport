//package mapogo.controller;
//
//
//
//import java.util.Arrays;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.ApplicationEventPublisher;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//import mapogo.entity.Message;
//import mapogo.service.MessageService;
//
//@Controller
//public class ChatWebSocketController {
//
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    private MessageService messageService;
//
////    @MessageMapping("/send")
////    public void sendMessage(Message message) {
////        // Lưu tin nhắn vào cơ sở dữ liệu
////    	System.err.println("message được gửi "+message);
////
////        messageService.saveMessage(message);
////        
//////        // Gửi tin nhắn đến người nhận
//////        messagingTemplate.convertAndSend("/topic/messages/" + message.getReceiver().getUsername(), message);
////        
////        // Gửi tin nhắn đến người nhận theo topic dựa trên username
////        String topic = "/topic/chat/" + message.getSender().getUsername() + "-" + message.getReceiver().getUsername();
////        messagingTemplate.convertAndSend(topic, message);
////    }
//    @Autowired
//    private ApplicationEventPublisher eventPublisher;
//    @MessageMapping("/send")
//    public void sendMessage(Message message) {
//        // Lưu tin nhắn vào cơ sở dữ liệu
//    	System.err.println("ssdsdsdsdsdsdsd");
//        System.err.println("Tin nhắn được gửi " + message);
//        
//        messageService.saveMessage(message);
//
//        // Sắp xếp tên người gửi và người nhận theo thứ tự alphabet
//        String[] users = new String[] {message.getSender().getUsername(), message.getReceiver().getUsername()};
//        Arrays.sort(users);
//
//        // Tạo topic chung cho cả người gửi và người nhận
//        String topic = "/topic/chat/" + users[0] + "-" + users[1];
//
//        // Gửi tin nhắn đến topic chung
//        messagingTemplate.convertAndSend(topic, message);
////        eventPublisher.publishEvent(new MessageSentEvent(this, message));
//
//    }
//}
