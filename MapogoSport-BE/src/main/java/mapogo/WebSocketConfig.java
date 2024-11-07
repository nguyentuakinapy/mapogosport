package mapogo;


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
        registry.addEndpoint("/chat").setAllowedOrigins("*").withSockJS(); // định nghĩa endpont, nơi các client sẽ kết nối để sử dụng chat socket
        						// cho phép mọi nguồn đều kết nối được
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // kích hoạt chat nội bộ, nếu client nào có kết nối đến endpont này thì đều sẽ nhận được tin nhắn
        config.setApplicationDestinationPrefixes("/app"); // định nghĩa tiền tố cho các tin nhắn gửi từ client đến server
    }
}
