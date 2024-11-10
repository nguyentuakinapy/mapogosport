//package mapogo.controller;
//
//
//import mapogo.entity.Message;
//import org.springframework.context.event.EventListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class MessageEventListener {
//
//    @EventListener
//    public void handleMessageSentEvent(MessageSentEvent event) {
//        Message message = event.getMessage();
//        System.out.println("Nội dung tin nhắn được gửi: " + message.getContent());
//        System.out.println("Người gửi: " + message.getSender().getUsername());
//        System.out.println("Người nhận: " + message.getReceiver().getUsername());
//    }
//}
