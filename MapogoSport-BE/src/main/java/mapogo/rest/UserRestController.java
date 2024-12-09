package mapogo.rest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.AuthorityDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.SubsciptionPaymentDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.dao.UserVoucherDAO;
import mapogo.dto.PaymentDTO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Authority;
import mapogo.entity.Notification;
import mapogo.entity.Owner;
import mapogo.entity.SubscriptionPayment;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;
import mapogo.entity.Wallet;
import mapogo.service.AccountPackageService;
import mapogo.service.EmailService;
import mapogo.service.OwnerService;
import mapogo.service.PaymentMethodService;
import mapogo.service.TransactionService;
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

	@Autowired
	NotificationDAO notificationDAO;

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
		emailService.sendEmail(email, "MapogoSport", otp);
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

	@Autowired
	OwnerDAO ownerDAO;

	@Autowired
	AuthorityDAO authorityDAO;

	@Autowired
	TransactionService transactionService;

	// Gia hạn
	@PostMapping("/user/subscription/updateUserSubscriptionByWallet/{userSubscriptionId}")
	public ResponseEntity<?> updateUserSubscriptionByWallet(
			@PathVariable("userSubscriptionId") Integer userSubscriptionId,
			@RequestBody Map<String, Object> requestBody, HttpServletRequest req) {
		UserSubscription uS = userSubscriptionDAO.findById(userSubscriptionId).get();
		User user = uS.getUser();
		Wallet wallet = walletService.findByUsername(user);
		int accountPackageId = (int) requestBody.get("accountPackageId");
		AccountPackage ap = accountPackageService.findById(accountPackageId);
		if (wallet.getBalance().compareTo(BigDecimal.valueOf(ap.getPrice())) >= 0) {
			wallet.setBalance(wallet.getBalance().subtract(BigDecimal.valueOf(ap.getPrice())));
			walletService.update(wallet);
			Transaction tran = new Transaction();
			tran.setWallet(wallet);
			tran.setAmount(BigDecimal.valueOf(ap.getPrice()));
			tran.setCreatedAt(LocalDateTime.now());
			tran.setDescription("Thanh toán gia hạn gói tài khoản: " + ap.getPackageName());
			tran.setTransactionType("-" + ap.getPrice());
			transactionService.create(tran);
			// walletAdmin
			walletService.addFundsToAdminWallet(BigDecimal.valueOf(ap.getPrice()),
					user.getUsername() + " thanh toán gói " + ap.getPackageName());
			userService.updateUserSubscription(accountPackageId, userSubscriptionId);
			return ResponseEntity.status(HttpStatus.SC_OK).body("ok");

		} else {
			return ResponseEntity.status(HttpStatus.SC_OK)
					.body("Số dư trong ví không đủ vui lòng phương thức " + "hoặc nạp thêm tiền vào ví!");

		}

	}

	@PutMapping("/user/subscription/update/{userSubscriptionId}")
	public ResponseEntity<?> updateUserSubscription(@PathVariable("userSubscriptionId") Integer userSubscriptionId,
			@RequestBody Map<String, Object> requestBody, HttpServletRequest req) throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = userSubService.createSubscriptionPayment(requestBody, req);
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}
	
	
	@PutMapping("/user/subscription/extend/{userSubscriptionId}")
	public ResponseEntity<?> extendUserSubscription(@PathVariable("userSubscriptionId") Integer userSubscriptionId,
			@RequestBody Map<String, Object> requestBody, HttpServletRequest req) throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = userSubService.createSubscriptionPayment(requestBody, req);
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}

	@GetMapping("/user/subscription/paymentInfo/{status}")
	public RedirectView updateUserSubscription2(@PathVariable("status") String status,@RequestParam(value = "vnp_OrderInfo") String data) {
		String[] parts = data.split("_");
		int accountPackageId = Integer.parseInt(parts[0]);
		int userSubscriptionId = Integer.parseInt(parts[1]);
		if (status.equals("extend")) {
			String date = parts[2];
			SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
			Date d;
			try {
				d = formatDate.parse(date);
				// SubscriptionPayment
				createSubcriptionPayment(accountPackageId, userSubscriptionId, "VNPay");
				userService.updateUserSubcription(userSubscriptionId, d, "VNPay");
				return new RedirectView("http://localhost:3002/owner");
//				return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}else {
			createSubcriptionPayment(accountPackageId, userSubscriptionId, "VNPay");
			userService.updateUserSubscription(accountPackageId, userSubscriptionId);
			return new RedirectView("http://localhost:3002/owner");
//			return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
		}
		return null;

	}

	@GetMapping("/user/subscription/paymentInfo-momo/{status}")
	public RedirectView getPaymentInfo(@PathVariable("status") String status,
			@RequestParam(value = "resultCode") String resultCode,
			@RequestParam(value = "extraData") String data) {
		if (resultCode.equals("0")) {
			String[] parts = data.split("_");
			int accountPackageId = Integer.parseInt(parts[0]);
			int userSubscriptionId = Integer.parseInt(parts[1]);
			if (status.equals("extend")) {
				String date = parts[2];
				SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
				Date d;
				try {
					d = formatDate.parse(date);
					// SubscriptionPayment
					createSubcriptionPayment(accountPackageId, userSubscriptionId, "MoMo");
					userService.updateUserSubcription(userSubscriptionId,d, "MoMo");
					return new RedirectView("http://localhost:3002/owner");
//					return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
				} catch (ParseException e) {
					e.printStackTrace();
				}
			} else {
				createSubcriptionPayment(accountPackageId, userSubscriptionId, "MoMo");
				userService.updateUserSubscription(accountPackageId, userSubscriptionId);
				return new RedirectView("http://localhost:3002/owner");
//				return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
			}
		}
		return null;
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

	// đăng ký
	@PostMapping("/subscription/payment")
	public ResponseEntity<?> userSubscriptionPayment(@RequestBody Map<String, Object> requestBody,
			HttpServletRequest req) throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = userSubService.createOwnerPayment(requestBody, req);
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}

	@GetMapping("/subscription/paymentInfo-Vnpay")
	public RedirectView paymentInfoVnpay(@RequestParam(value = "vnp_ResponseCode") String responseCode,
			@RequestParam(value = "vnp_OrderInfo") String data) {
		String[] parts = data.split("-");
		int userSubscriptionId = Integer.parseInt(parts[0]);
		int ownerId = Integer.parseInt(parts[1]);
		int authorityId = Integer.parseInt(parts[2]);
		UserSubscription userSubscription = userSubscriptionDAO.findById(userSubscriptionId).get();

		if (responseCode.equals("00")) {
			int accountPackageId = userSubscription.getAccountPackage().getAccountPackageId();
			// SubscriptionPayment
			createSubcriptionPayment(accountPackageId, userSubscriptionId, "VNPay");
			return new RedirectView("http://localhost:3002/owner");
//			return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
		} else {
			userSubscriptionDAO.delete(userSubscription);
			Owner owner = ownerDAO.findById(ownerId).get();
			ownerDAO.delete(owner);
			Authority auth = authorityDAO.findById(authorityId).get();
			authorityDAO.delete(auth);
		}
		return new RedirectView("http://localhost:3002");
//		return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002");
	}

	@GetMapping("/subscription/paymentInfo-momo")
	public RedirectView paymentInfoMomo(@RequestParam(value = "resultCode") String resultCode,
			@RequestParam(value = "extraData") String data) {

		String[] parts = data.split("-");
		int userSubscriptionId = Integer.parseInt(parts[0]);
		int ownerId = Integer.parseInt(parts[1]);
		int authorityId = Integer.parseInt(parts[2]);
		UserSubscription userSubscription = userSubscriptionDAO.findById(userSubscriptionId).get();
		if (resultCode.equals("0")) {
			int accountPackageId = userSubscription.getAccountPackage().getAccountPackageId();
			// SubscriptionPayment
			createSubcriptionPayment(accountPackageId, userSubscriptionId, "MoMo");
			return new RedirectView("http://localhost:3002/owner");
//			return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/owner");
		} else {
			userSubscriptionDAO.delete(userSubscription);
			Owner owner = ownerDAO.findById(ownerId).get();
			ownerDAO.delete(owner);
			Authority auth = authorityDAO.findById(authorityId).get();
			authorityDAO.delete(auth);
		}

		return new RedirectView("http://localhost:3002");
//		return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002");
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

	@GetMapping("/user/findByUser_UsernameContainingAndTypeContaining/{username}/{type}")
	public List<Notification> findByUser_UsernameContainingAndTypeContaining(@PathVariable("username") String username,
			@PathVariable("type") String type) {
		return userService.findByUser_UsernameContainingAndTypeContaining(username, type);
	}

	@PutMapping("/user/notification/{username}")
	public void setViewNotification(@PathVariable("username") String username) {
		userService.setViewNotification(username);
	}

	@PutMapping("/user/notification/setViewNotificationTypeNotifyMess/{username}")
	public void setViewNotificationTypeNotifyMess(@PathVariable("username") String username) {
		System.err.println("API request received with username: " + username); // Log thêm thông tin
		userService.setViewNotificationTypeNotifyMess(username);
	}

	@PutMapping("/user/notification/is/read/{notificationId}")
	public void setIsReadNotification(@PathVariable("notificationId") Integer notificationId) {
		userService.setIsReadNotification(notificationId);
	}

	@DeleteMapping("/user/notification/{username}")
	public void deleteNotification(@PathVariable("username") String username) {
		userService.deleteNotification(username);
	}

	@DeleteMapping("/user/notification/deleteNotificationHaveTypeNotifyMess/{username}")
	public void deleteNotificationHaveTypeNotifyMess(@PathVariable("username") String username) {
		userService.deleteNotificationHaveTypeNotifyMess(username);
	}

	@Autowired
	WalletService walletService;

	// của Mỵ từ đây
	@PostMapping("/wallet/createpaymentrecharge")
	public ResponseEntity<?> createPaymentRecharge(@RequestBody Map<String, Object> requestBody, HttpServletRequest req)
			throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = userSubService.createPaymentRecharge(requestBody, req);
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);
	}

	@GetMapping("/wallet/createpaymentrecharge/infoVnpay")
	public RedirectView getInfoVnpay(@RequestParam(value = "vnp_ResponseCode") String responseCode,
			@RequestParam(value = "vnp_OrderInfo") String data) {
		String[] parts = data.split("-");
		String username = (parts[0]);
		Double money = Double.parseDouble(parts[1]);

		if (responseCode.equals("00")) {
			walletService.addMoney(username, money);

		}
		return new RedirectView("http://localhost:3002/user/wallet");
//		return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/user/wallet");
	}

	@GetMapping("/wallet/createpaymentrecharge/infoMomo")
	public RedirectView getInfoMomo(@RequestParam(value = "resultCode") String responseCode,
			@RequestParam(value = "extraData") String data) {
		String[] parts = data.split("-");
		String username = (parts[0]);
		Double money = Double.parseDouble(parts[1]);

		if (responseCode.equals("0")) {
			walletService.addMoney(username, money);

		}
		return new RedirectView("http://localhost:3002/user/wallet");
//		return new RedirectView("http://fpl-mapogo1.qast.io.vn:3002/user/wallet");
	}

	// đến đây

	@PutMapping("/user/subscription/extend/{idUserSub}/{endDate}")
	public UserSubscription updateUserSubcription(@PathVariable("idUserSub") Integer id,
			@PathVariable("endDate") Date endDate) {
		return userService.updateUserSubcription(id, endDate, "Thanh toán ví");
	}
}
