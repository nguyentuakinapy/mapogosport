package mapogo.security;

import java.security.MessageDigest;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	private final CustomUserDetailsService customUserDetailsService;

	public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
		this.customUserDetailsService = customUserDetailsService;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new PasswordEncoder() {
			private final String SALT = "YOUR_FIXED_SALT"; // Phải đồng bộ với FE

			@Override
			public String encode(CharSequence rawPassword) {
				return hashWithSalt(rawPassword.toString(), SALT);
			}

			@Override
			public boolean matches(CharSequence rawPassword, String encodedPassword) {
				String hashedPassword = hashWithSalt(rawPassword.toString(), SALT);
				return hashedPassword.equals(encodedPassword);
			}

			private String hashWithSalt(String password, String salt) {
				try {
					MessageDigest md = MessageDigest.getInstance("SHA-256");
					md.update((password + salt).getBytes());
					byte[] bytes = md.digest();
					StringBuilder sb = new StringBuilder();
					for (byte b : bytes) {
						sb.append(String.format("%02x", b));
					}
					return sb.toString();
				} catch (Exception e) {
					throw new RuntimeException("Error hashing password", e);
				}
			}
		};
	}

	@Bean
	public AuthenticationProvider authProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(customUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;	
	}

	@Bean
	public AuthenticationManager authenticationManager() {
		return authentication -> authProvider().authenticate(authentication);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(request -> {
			CorsConfiguration config = new CorsConfiguration();
//                    config.setAllowedOrigins(List.of("http://26.102.221.2:3000")); // Ngu?n ???c phép
			config.setAllowedOrigins(List.of("http://localhost:3000")); // Ngu?n ???c phép
			config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Ph??ng th?c HTTP ???c phép
			config.setAllowedHeaders(List.of("*")); // Header ???c phép
			config.setAllowCredentials(true); // Cho phép g?i cookie
			return config;
		})).authorizeHttpRequests(authz -> authz.requestMatchers("/rest/**", "/api/messages/**", "/ws/**", // Endpoint
																											// WebSocket
				"/app/**", // STOMP message mappings
				"/topic/**" // Destination for messages
		).permitAll().anyRequest().authenticated() // Mọi yêu cầu khác yêu cầu xác thực
		).formLogin(form -> form.successHandler((request, response, authentication) -> {
			// Tr? v? HTTP 200 khi ??ng nh?p thành công (frontend x? lý ti?p)
			response.setStatus(HttpServletResponse.SC_OK);
		}).failureHandler((request, response, exception) -> {
			// Tr? v? HTTP 401 khi ??ng nh?p th?t b?i
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		}).permitAll() // ??m b?o API ??ng nh?p có th? ???c truy c?p mà không c?n xác th?c
		).logout(logout -> logout.logoutSuccessHandler((request, response, authentication) -> {
			// Tr? v? HTTP 200 sau khi ??ng xu?t thành công
			response.setStatus(HttpServletResponse.SC_OK);
		}).permitAll()).csrf(csrf -> csrf.disable()); // T?t CSRF n?u frontend không g?i CSRF token
		return http.build();
	}

}
