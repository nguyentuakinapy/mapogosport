package mapogo.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
    	// phương thức này định nghĩa cú pháp bắt buộc để clent có thể kết nối đến BE phải có endpoint là app
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3002").withSockJS();
//        registry.addEndpoint("/ws").setAllowedOrigins("http://fpl-mapogo1.qast.io.vn:3002").withSockJS();
    }

    		// Xử lý việc nhận và gửi tin nhắn
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    	// chỉ định rằng tất cả các tin nhắn gửi từ client đến server phải bắt đầu bằng /app
    	registry.setApplicationDestinationPrefixes("/app"); // gửi tin
    	// kích hoạt bộ nhớ đã lưu bên trong ram, khi tin nhắn được gửi tới nó sẽ kiểm tra topic và phần phát tin nhắn
    	// đó cho những client nào đã kết nối đển topic đó
        registry.enableSimpleBroker("/topic"); // nhận tin và phân phát tới những toipic nào bắt đầu bằng chữu topic
    }
}
