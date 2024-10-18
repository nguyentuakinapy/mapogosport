package mapogo.rest;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dao.ProductDAO;
import mapogo.entity.Product;
import mapogo.entity.User;
import mapogo.service.EmailService;
import mapogo.service.UserService;
import mapogo.utils.RandomUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest")
public class UserRestController {
	@Autowired
	UserService userService;

	@Autowired
	EmailService emailService;

	@GetMapping("/user/{username}")
	public User findUseLoginUser(@PathVariable("username") String username) {
		return userService.findByUsername(username);
	}

	@GetMapping("/user")
	public List<User> getAll() {
		return userService.findAll();
	}

	@GetMapping("/user/getbyemail/{email}")
	public User getByEmail(@PathVariable("email") String email) {
		System.out.println(email);
		return userService.findByEmail(email);
	}
	
	@PostMapping("/user")
	public User saveStudents(@RequestBody User u) {
		System.out.println(u.getFullname());
		return userService.createUser(u);
	}

	@PutMapping("/user/{username}")
	public void putStudent(@PathVariable("username") String username, @RequestBody User u) {
		userService.updateUser(u);
	}

	@PostMapping("/user/sendMail")
	public String sendMail(@RequestBody String username) {
		String otp = RandomUtils.generateOTP();
		emailService.sendEmail(username, "MapogoSport", "Bạn đã yêu cầu gửi mã xác nhận mới! Mã của bạn là: " + otp);
		return otp;
	}
	
	@PostMapping("/user/changePassword/sendMail")
	public void passMail(@RequestBody Map<String, String> requestBody) {
		 String email = requestBody.get("email");
		 emailService.sendEmail(email, "MapogoSport", "Bạn đã thay đổi mật khẩu tài khoản. Nếu đó không phải là bạn, vui lòng liên hệ với chúng tôi ngay.");
	}

	@Autowired
	ProductDAO productDAO;

	@GetMapping("/product")
	public List<Product> findAll() {
		return productDAO.findAll();
	}
	// ??? sao nó nằm ở đây?
}
