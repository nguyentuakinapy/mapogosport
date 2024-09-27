package mapogo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class CookieService {
	@Autowired
	HttpServletRequest req;
	@Autowired
	HttpServletResponse resp;

	// Tạo cookie và lưu dữ liệu vào bên trong theo Tên - Dữ liệu truyền vào - Số
	// ngày mà cookie có thể lưu - HttpServletResponse response
	public void create(String name, String value, int days, HttpServletResponse response) {
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(days * 24 * 60 * 60); // thời gian sống của cookie tính bằng giây
		cookie.setPath("/"); // thiết lập đường dẫn cho cookie
		response.addCookie(cookie); // thêm cookie vào phản hồi HTTP
	}

	public String getValue(String name, HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					return cookie.getValue();
				}
			}
		}
		return null;
	}

	public void clearCookies(HttpServletRequest req,HttpServletResponse resp) {
    	 Cookie[] cookies = req.getCookies();
    	 if(cookies != null) {
    		 for(Cookie cookie : cookies) {
    			 cookie.setMaxAge(0);
    			 resp.addCookie(cookie);
    		 }
    	 }
     }
}