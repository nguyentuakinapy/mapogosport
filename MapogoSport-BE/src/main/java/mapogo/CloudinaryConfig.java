package mapogo;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
	private final String CLOUD_NAME = "disnzpdvj";
	private final String API_KEY = "636256514458547";
	private final String API_SECRET = "E_gZdeAUYsFKlWePqlEkZXiL5Ms";
	
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", CLOUD_NAME,
            "api_key", API_KEY,
            "api_secret", API_SECRET
        ));
    }
}
