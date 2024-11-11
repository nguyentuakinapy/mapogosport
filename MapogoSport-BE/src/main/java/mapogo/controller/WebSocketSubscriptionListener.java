//package mapogo.controller;
//
//import org.springframework.context.ApplicationListener;
//import org.springframework.context.event.EventListener;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.messaging.SessionSubscribeEvent;
//import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;
//
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.ConcurrentMap;
//
//@Component
//public class WebSocketSubscriptionListener implements ApplicationListener<SessionSubscribeEvent> {
//
//    private final ConcurrentMap<String, Integer> topicSubscriptions = new ConcurrentHashMap<>();
//
//    @Override
//    public void onApplicationEvent(SessionSubscribeEvent event) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String destination = headerAccessor.getDestination();
//        
//        if (destination != null) {
//            // Tăng số lượng đăng ký vào topic này
//            topicSubscriptions.merge(destination, 1, Integer::sum);
//            System.out.println("Số lượng người đăng ký vào " + destination + ": " + topicSubscriptions.get(destination));
//        }
//    }
//    
//    @EventListener
//    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
//        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//        String destination = headerAccessor.getDestination();
//
//        if (destination != null && topicSubscriptions.containsKey(destination)) {
//            topicSubscriptions.merge(destination, -1, Integer::sum);
//            if (topicSubscriptions.get(destination) <= 0) {
//                topicSubscriptions.remove(destination);
//            }
//            System.out.println("Số lượng người còn lại trong " + destination + ": " + topicSubscriptions.getOrDefault(destination, 0));
//        }
//    }
//
//    public int getSubscriptionCount(String topic) {
//        return topicSubscriptions.getOrDefault(topic, 0);
//    }
//}
