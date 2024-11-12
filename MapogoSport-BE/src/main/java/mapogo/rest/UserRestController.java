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
import mapogo.dao.UserVoucherDAO;
import mapogo.entity.Notification;
import mapogo.entity.Owner;
import mapogo.entity.Product;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;
import mapogo.entity.UserVoucher;
import mapogo.service.EmailService;
import mapogo.service.OwnerService;
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

	@Autowired
	UserVoucherDAO userVoucherRepository;
	
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
		return userService.createUser(u);
	}

	@PutMapping("/user/{username}")
	public void putStudent(@PathVariable("username") String username, @RequestBody User u) {
		userService.updateUser(u);
	}

	@PostMapping("/user/sendMail")
	public String sendMail(@RequestBody String email) {
		String otp = RandomUtils.generateOTP();
		emailService.sendEmail(email, "MapogoSport", "Bạn đã yêu cầu gửi mã xác nhận mới! Mã của bạn là: " + otp);
		return otp;
	}

	@PostMapping("/user/changePassword/sendMail")
	public void passMail(@RequestBody Map<String, String> requestBody) {
		String email = requestBody.get("email");
		emailService.sendEmail(email, "MapogoSport",
				"Bạn đã thay đổi mật khẩu tài khoản. Nếu đó không phải là bạn, vui lòng liên hệ với chúng tôi ngay.");
	}
	
	@PostMapping("/user/updateEmail/sendMail")
	public void sendUpdateMail(@RequestBody Map<String, String> requestBody) {
		String email = requestBody.get("email");
		emailService.sendEmail(email, "MapogoSport",
				"Bạn đã thay đổi email tài khoản. Nếu đó không phải là bạn, vui lòng liên hệ với chúng tôi ngay.");
	}

	@Autowired
	OwnerService ownerService;

	@GetMapping("/owner/{id}")
	public Owner findByUser(@PathVariable("id") String username) {
		return ownerService.findByUsername(username);
	}
	
	@PostMapping("/owner")
	public Owner saveOwner(@RequestBody Map<String, Object> requestBody) {
		return ownerService.save(requestBody);
	}

	@PostMapping("/user/subscription")
	public UserSubscription saveUserSubscription(@RequestBody Map<String, Object> requestBody) {
		return userService.saveUserSubcription(requestBody);
	}
	
	@PutMapping("/user/subscription/{userSubscriptionId}")
	public void updateUserSubscription(@PathVariable("userSubscriptionId") Integer userSubscriptionId, 
			@RequestBody Map<String, Object> requestBody) {
		userService.updateUserSubscription(requestBody);
	}
	
	@GetMapping("/user/subscription/{id}")
	public UserSubscription findUserSubscriptionByUser(@PathVariable("id") String username) {
		return userService.findUserSubscriptionByUser(username);
	}
	
	@GetMapping("/user/getbysportdetailid/{id}")
	public User findTestr(@PathVariable("id") Integer id) {
		return userService.findUserByBookingDetailId(id);
	}
	
	@GetMapping("/user/notification/{username}")
	public List<Notification> findNotificationByUsername(@PathVariable("username") String username){
		return userService.findNotificationByUsername(username);
	}
}
