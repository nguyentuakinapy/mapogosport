package mapogo.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.ProductDAO;
import mapogo.dao.SubsciptionPaymentDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.dao.UserVoucherDAO;
import mapogo.dao.WalletDAO;
import mapogo.dto.PaymentDTO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Notification;
import mapogo.entity.Owner;
import mapogo.entity.PaymentMethod;
import mapogo.entity.Product;
import mapogo.entity.SubscriptionPayment;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;
import mapogo.entity.UserVoucher;
import mapogo.service.AccountPackageService;
import mapogo.service.EmailService;
import mapogo.service.OwnerService;
import mapogo.service.PaymentMethodService;
import mapogo.service.UserService;
import mapogo.service.UserSubscriptionService;
import mapogo.service.WalletService;
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

	@PostMapping("/user/avatar/{username}")
	public void uploadAvatar(@PathVariable("username") String username, @RequestParam("avatar") MultipartFile file)
			throws IOException {
		userService.uploadAvatar(username, file);
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

//Mỵ sửa
	@Autowired
	UserSubscriptionService userSubService;

	@Autowired
	AccountPackageService accountPackageService;

	@Autowired
	PaymentMethodService paymentMethodService;

	@Autowired
	UserSubscriptionDAO userSubscriptionDAO;

	@Autowired
	SubsciptionPaymentDAO subsciptionPaymentDAO;

	@PutMapping("/user/subscription/{userSubscriptionId}")
	public ResponseEntity<?> updateUserSubscription(@PathVariable("userSubscriptionId") Integer userSubscriptionId,
			@RequestBody Map<String, Object> requestBody, HttpServletRequest req) throws UnsupportedEncodingException {
		// thanh toán
		PaymentDTO paymentDTO = userSubService.createSubscriptionPayment(requestBody, req);
//		System.out.println(paymentDTO.getURL());
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}

	@GetMapping("/user/subscription/paymentInfo")
	public RedirectView updateUserSubscription2(@RequestParam(value = "vnp_OrderInfo") String data) {
		String[] parts = data.split("-");
		int accountPackageId = Integer.parseInt(parts[0]);
		int userSubscriptionId = Integer.parseInt(parts[1]);

		// SubscriptionPayment
		createSubcriptionPayment(accountPackageId, userSubscriptionId, "VNPay");
		userService.updateUserSubscription(accountPackageId, userSubscriptionId);
		return new RedirectView("http://localhost:3000/owner");
	}

	@GetMapping("/user/subscription/paymentInfo-momo")
	public RedirectView getPaymentInfo(@RequestParam(value = "resultCode") String resultCode,
			@RequestParam(value = "extraData") String data) {
		if (resultCode.equals("0")) {
			String[] parts = data.split("0");
			int accountPackageId = Integer.parseInt(parts[0]);
			int userSubscriptionId = Integer.parseInt(parts[1]);
			// SubscriptionPayment
			createSubcriptionPayment(accountPackageId, userSubscriptionId, "MoMo");
			userService.updateUserSubscription(accountPackageId, userSubscriptionId);
		}
		return new RedirectView("http://localhost:3000/owner");
	}

	private void createSubcriptionPayment(int accountPackageId, int userSubscriptionId, String paymentMethod) {
		// SubscriptionPayment
		AccountPackage accountPackage = accountPackageService.findById(accountPackageId);
		UserSubscription uS = userSubscriptionDAO.findById(userSubscriptionId).get();

		SubscriptionPayment subPayment = new SubscriptionPayment();
		subPayment.setAmount(accountPackage.getPrice());
		subPayment.setPaymentDate(LocalDateTime.now());
		subPayment.setPaymentMethod(paymentMethodService.findByName(paymentMethod));
		subPayment.setStatus("Đã thanh toán");
		subPayment.setUser(uS.getUser());
		subPayment.setUserSubscription(uS);
		subsciptionPaymentDAO.save(subPayment);
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
	public List<Notification> findNotificationByUsername(@PathVariable("username") String username) {
		return userService.findNotificationByUsername(username);
	}

	@PutMapping("/user/notification/{username}")
	public void setViewNotification(@PathVariable("username") String username) {
		userService.setViewNotification(username);
	}

	@PutMapping("/user/notification/is/read/{notificationId}")
	public void setIsReadNotification(@PathVariable("notificationId") Integer notificationId) {
		userService.setIsReadNotification(notificationId);
	}

	@DeleteMapping("/user/notification/{username}")
	public void deleteNotification(@PathVariable("username") String username) {
		userService.deleteNotification(username);
	}

	@Autowired
	WalletService walletService;

	@PutMapping("/wallet/{username}/{money}")
	public void addMoney(@PathVariable("username") String username,
			@PathVariable("money") Double money) {
		walletService.addMoney(username, money);
	}
}
