//package mapogo.service;
//
//
//import java.util.List;
//import java.util.stream.Stream;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Service;
//
//import jakarta.servlet.http.HttpServletRequest;
//
//@Service("auth")
//public class AuthService {
//	@Autowired
//	HttpServletRequest request;
//	
//	public Authentication getAuthentication() {
//		return (Authentication) request.getUserPrincipal();
//	}
//	
//	public boolean isAuthenticated() {
//		return (this.getAuthentication() != null);
//	}
//	
//	public UserDetails getUserDetails() {
//		Authentication auth = this.getAuthentication();
//		return (UserDetails) auth.getPrincipal();
//	}
//
//	public String getUsername() {
//		UserDetails user = this.getUserDetails();
//		return user.getUsername();
//	}
//	
//	public List<String> getRoles() {
//	    UserDetails user = this.getUserDetails();
//	    return user.getAuthorities().stream()
//	        .map(au -> {
//	            String authority = au.getAuthority();
//	            // Kiểm tra nếu chuỗi có độ dài lớn hơn 5 và bắt đầu bằng "ROLE_"
//	            if (authority.length() > 5 && authority.startsWith("ROLE_")) {
//	                return authority.substring(5); // Bỏ tiền tố "ROLE_"
//	            } else {
//	                return authority; // Trả về toàn bộ nếu không có tiền tố "ROLE_"
//	            }
//	        })
//	        .toList();
//	}
//
//	
//	public boolean hasRole(String...roles) {
//		return this.isAuthenticated() && 
//				Stream.of(roles).anyMatch(role -> this.getRoles().contains(role));
//	}
//	
//	public boolean isDire() {
//		return this.hasRole("DIRE");
//	}
//	
//	public boolean isStaf() {
//		return this.hasRole("STAF");
//	}
//	@Override
//	public String toString() {
//		return this.getUsername() + ": " +  this.getRoles();
//	}
//}
