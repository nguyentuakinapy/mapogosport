package mapogo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Thay đổi theo đường dẫn API của bạn
                .allowedOrigins("http://localhost:3002") // Thay đổi nếu cần
//                .allowedOrigins("http://fpl-mapogo1.qast.io.vn:3002") // Thay đổi nếu cần
//                .allowedOrigins("http://26.102.221.2:3000") // Thay đổi nếu cần
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các phương thức cho phép
                .allowedHeaders("*"); // Cho phép tất cả các headers
    }
}
