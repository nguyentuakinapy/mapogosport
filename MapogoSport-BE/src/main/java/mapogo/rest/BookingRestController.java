package mapogo.rest;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.time.LocalDate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.SportFieldDetailDAO;
import mapogo.dto.PaymentDTO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;

import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Wallet;

import mapogo.service.BookingDetailService;
import mapogo.service.BookingService;
import mapogo.service.TransactionService;
import mapogo.service.UserService;
import mapogo.service.UserSubscriptionService;
import mapogo.service.WalletService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rest")
public class BookingRestController {
	@Autowired
	BookingService bookingService;

	@Autowired
	BookingDetailService bookingDetailService;

	@Autowired
	TransactionService transactionService;

	@GetMapping("/booking")
	public List<Booking> findAll() {
		return bookingService.findAll();
	}

	@GetMapping("/owner/booking/findAll/{ownerUsername}")
	public List<Map<String, Object>> ownerFindAll(@PathVariable("ownerUsername") String ownerUsername) {
		return bookingService.findAllBookingByOwner(ownerUsername);
	}

	@PutMapping("/owner/booking/update")
	public void updateBookingStatus(@RequestBody Map<String, Object> bookingData) {
		bookingService.updateStatusBooking(bookingData);
	}

	@PutMapping("/owner/bookingDetail/update")
	public void updateBookingDetailStatus(@RequestBody Map<String, Object> bookingDetailData) {
		bookingDetailService.updateStatusBookingDetail(bookingDetailData);
	}

	@GetMapping("/user/booking/{username}")
	public List<Map<String, Object>> getByUser(@PathVariable("username") String username) {
		return bookingService.findBookingByUsername(username);
	}

	@GetMapping("/user/booking/detail/{bookingId}")
	public List<Map<String, Object>> getById(@PathVariable("bookingId") Integer bookingId) {
		return bookingDetailService.findBookingDetailByBookingId(bookingId);
	}

	@GetMapping("/user/booking/detail/getbyday/{sportDetailId}/{date}")
	public List<BookingDetail> findBySportFieldDetailAndday(@PathVariable("sportDetailId") Integer sportDetailId,
			@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return bookingDetailService.findBySportFieldDetailAndDay(sportDetailId, date);
	}

	@GetMapping("/user/booking/detail/getbyday/subscriptionkey/{subscriptionkey}")
	public List<BookingDetail> findBookingDetailBySubscriptionKey(
			@PathVariable("subscriptionkey") String subscriptionKey) {
		return bookingDetailService.findBookingDetailBySubscriptionKey(subscriptionKey);
	}

	@GetMapping("/user/booking/detail/getnextweek/{sportDetailId}/{startDay}/{endDay}")
	public List<BookingDetail> findBySportFieldDetailAndNextWeek(@PathVariable("sportDetailId") Integer sportDetailId,
			@PathVariable("startDay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDay,
			@PathVariable("endDay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDay) {

		return bookingDetailService.findBySportFieldDetailAndNextWeek(sportDetailId, startDay, endDay);
	}

	@PostMapping("/booking")
	public Booking saveBooking(@RequestBody Map<String, Object> b) {
		return bookingService.createBooking(b);
	}

	@PostMapping("/booking/detail")
	public BookingDetail saveBookingDetail(@RequestBody Map<String, Object> bd) {
		return bookingDetailService.createBookingDetail(bd);
	}

	@PostMapping("/booking/detail/create/period")
	public void saveBookingDetailPeriod(@RequestBody List<Map<String, Object>> bd) {
		bookingDetailService.createBookingDetailPeriod(bd);
	}
	
	@PostMapping("/booking/payment")
	public ResponseEntity<?> createPayment(@RequestBody Map<String, Object> data, HttpServletRequest req)
			throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = bookingService.createPayment(data, req);
		return ResponseEntity.status(HttpStatus.SC_OK).body(paymentDTO);

	}

	@Autowired
	SportFieldDetailDAO sportDetailDAO;

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Autowired
	WalletService walletService;
	
	@Autowired
	UserService userService;
	
	@Autowired
	BookingDAO bookingDao;

	private void createTransaction(User user, String trimmedAmount, Integer bookingId, String paymentMethod) {
		// update +Balance
		Wallet wallet = walletService.findByUsername(user);

		// create transaction
		Transaction transaction = new Transaction();
		transaction.setWallet(wallet);
		transaction.setAmount(new BigDecimal(trimmedAmount));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Nạp từ hóa đơn đặt sân: (" + paymentMethod + ")");
		transaction.setTransactionType("+" + trimmedAmount);
		transactionService.create(transaction);

		// create bookingPayment

		// -balance -> create transaction
		Transaction transaction1 = new Transaction();
		transaction1.setWallet(wallet);
		transaction1.setAmount(new BigDecimal(trimmedAmount));
		transaction1.setCreatedAt(LocalDateTime.now());
		transaction1.setDescription("Thanh toán hóa đơn đặt sân: (" + paymentMethod + ")");
		transaction1.setTransactionType("-" + trimmedAmount);
		transactionService.create(transaction1);
	}

	@GetMapping("/booking/paymentInfo")
	public RedirectView updateUserSubscription2(@RequestParam(value = "vnp_ResponseCode") String responseCode,
			@RequestParam(value = "vnp_OrderInfo") String data,
			@RequestParam(value = "vnp_Amount") String amount) {
		
		String[] parts = data.split("-");
		int sportFielDetailId = Integer.parseInt(parts[0]);
		String username = parts[1];
		
		SportFieldDetail sportDetail = sportDetailDAO.findById(sportFielDetailId).get();
		Integer sportFieldId = sportDetail.getSportField().getSportFieldId();
		User user = userService.findByUsername(username);
		String trimmedAmount = amount.substring(0, amount.length() - 2);

		if (responseCode.equals("00")) {
			createTransaction(user, trimmedAmount, null, "VNPay");
			return new RedirectView(
					"http://localhost:3000/categories/sport_field/detail/" + sportFieldId + "?status=success");
		} else {
			return new RedirectView(
					"http://localhost:3000/categories/sport_field/detail/" + sportFieldId + "?status=fail");
		}
	}

	@GetMapping("/booking/paymentInfo-momo")
	public RedirectView paymentInfoMomo(@RequestParam(value = "resultCode") String resultCode,
			@RequestParam(value = "extraData") String data, @RequestParam(value = "amount") String amount) {
		
		String[] parts = data.split("-");
		int sportFielDetailId = Integer.parseInt(parts[1]);
		String username = parts[0];
		
		SportFieldDetail sportDetail = sportDetailDAO.findById(sportFielDetailId).get();
		Integer sportFieldId = sportDetail.getSportField().getSportFieldId();
		User user = userService.findByUsername(username);

		if (resultCode.equals("0")) {
			createTransaction(user, amount, null, "MoMo");
			return new RedirectView(
					"http://localhost:3000/categories/sport_field/detail/" + sportFieldId + "?status=success");

		} else {
			return new RedirectView(
					"http://localhost:3000/categories/sport_field/detail/" + sportFieldId + "?status=fail");
		}
	}

	@GetMapping("/booking/successful/revenue/{status}/{ownerId}")
	public List<Booking> findBookingAmountByOwnerAndStatus(@PathVariable("ownerId") Integer ownerId,
			@PathVariable("status") String status) {
		return bookingService.findBookingAmountByOwnerAndStatus(ownerId, status);
	}

	@GetMapping("/bookingdetail/booking/bysportField/byowner/{sportFieldIds}/{bookingId}/{status}")
	public List<BookingDetail> findBookingDetailBySportFieldAndOwner(
			@PathVariable("sportFieldIds") List<Integer> sportFieldIds,
			@PathVariable("bookingId") List<Integer> bookingId, @PathVariable("status") List<String> status) {

		return bookingService.findBookingDetailBySportFieldAndOwner(sportFieldIds, bookingId, status);
	}

	@GetMapping("/bookingdetail/booking/bysportFieldDetail/{sportFieldIds}/{bookingId}/{status}")
	public List<Object[]> findRevenueBySportFieldDetailIds(@PathVariable("sportFieldIds") List<Integer> sportFieldIds,
			@PathVariable("bookingId") List<Integer> bookingId, @PathVariable("status") List<String> status) {
		return bookingService.findRevenueBySportFieldDetailIds(sportFieldIds, bookingId, status);
	}

	@GetMapping("/booking/detail/findbystarttime/sportfielddetail/{startTime}/{sportFieldDetailId}/{date}")
	public BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(@PathVariable("startTime") String startTime,
			@PathVariable("sportFieldDetailId") Integer sportFieldDetailId,
			@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return bookingDetailService.findBookingDetailByStartTimeDateAndSportDetailId(startTime, sportFieldDetailId,
				date);
	}

	@GetMapping("/bookingdetail/bysportFieldDetail/{sportFieldIds}/{bookingId}/{status}")
	public List<BookingDetail> findBookingDetailBySportFieldId(@PathVariable("sportFieldIds") Integer sportFieldIds,
			@PathVariable("bookingId") List<Integer> bookingId, @PathVariable("status") List<String> status) {
		return bookingService.findBookingDetailBySportFieldId(sportFieldIds, bookingId, status);
	}

	// Get revenue by Date

	@GetMapping("/booking/success/revenue/byDate/{status}/{ownerId}/{startDate}/{endDate}")
	public List<Booking> findRevenueByDate(@PathVariable("status") String status,
			@PathVariable("ownerId") Integer ownerId, @PathVariable("startDate") String startDate,
			@PathVariable("endDate") String endDate) {

		return bookingService.findRevenueByDate(status, ownerId, startDate, endDate);
	}

	@GetMapping("/bookingDetail/byOwner/bySportField/byDate/{sportFieldIds}/{bookingId}/{status}/{startDate}/{endDate}")
	public List<BookingDetail> findBookingDetailByDate(@PathVariable("sportFieldIds") List<Integer> sportFieldIds,
			@PathVariable("bookingId") List<Integer> bookingId, @PathVariable("status") List<String> status,
			@PathVariable("startDate") String startDate, @PathVariable("endDate") String endDate) {
		return bookingService.findBookingDetailByDate(sportFieldIds, bookingId, status, startDate, endDate);
	}

	@GetMapping("/bookingDetail/bySportField/byDate/{sportFieldDetailIds}/{bookingId}/{status}/{startDate}/{endDate}")
	public List<Object[]> findRevenueBySportFieldDetailIdsByDate(
			@PathVariable("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@PathVariable("bookingId") List<Integer> bookingId, @PathVariable("status") List<String> status,
			@PathVariable("startDate") String startDate, @PathVariable("endDate") String enDate) {

		return bookingService.findRevenueBySportFieldDetailIdsByDate(sportFieldDetailIds, bookingId, status, startDate,
				enDate);
	}

	@GetMapping("/bookingdetail/bysportFieldDetailAndDate/{sportFieldIds}/{bookingId}/{status}/{startDate}/{endDate}")
	public List<BookingDetail> findBookingDetailBySportFieldIdAndDate(
			@PathVariable("sportFieldIds") Integer sportFieldIds, @PathVariable("bookingId") List<Integer> bookingId,
			@PathVariable("status") List<String> status, @PathVariable("startDate") String startDate,
			@PathVariable("endDate") String enDate) {
		return bookingService.findBookingDetailBySportFieldIdAndDate(sportFieldIds, bookingId, status, startDate, enDate);

	}

	@GetMapping("/booking/byOwnerId/totalCustomer/{ownerId}")
	public Integer totalCustomer(@PathVariable("ownerId") Integer ownerId) {

		return bookingService.totalCustomer(ownerId);
	}

	@GetMapping("/booking/customerByMonth/byOwnerId/{year}/{ownerId}")
	public Map<Integer, Integer> findCustomerCountsByMonth(@PathVariable("year") Integer year,
			@PathVariable("ownerId") Integer ownerId) {

		return bookingService.findCustomerCountsByMonth(year, ownerId);
	}

	@GetMapping("/booking/customer/byOwner/byUsernameOffline/{ownerId}")
	public List<Object[]> findBookingByOwnerIdUsername(@PathVariable("ownerId") Integer ownerId) {

		return bookingService.findBookingByOwnerIdUsernameOffline(ownerId);
	}

	@PutMapping("/booking/update/status/{bookingDetailId}")
	public void cancelBookingDetail(@PathVariable("bookingDetailId") Integer bookingDetailId,
			@RequestBody String note) {
		bookingDetailService.cancelBookingDetail(bookingDetailId, note);
	}

	@PutMapping("/booking/update/status/by/subcriptionKey/{bookingDetailId}/{subscriptionKey}")
	public void cancelBookingDetailBySubscription(@PathVariable("bookingDetailId") Integer bookingDetailId,
			@PathVariable("subscriptionKey") String subscriptionKey, @RequestBody String note) {
		bookingDetailService.cancelBookingDetailBySubscription(bookingDetailId, subscriptionKey, note);
	}

	@PutMapping("/booking/update/booking/detail/{bookingDetailId}")
	public void updateBookingDetail(@PathVariable("bookingDetailId") Integer bookingDetailId,
			@RequestBody Map<String, Object> data) {
		bookingDetailService.updateBookingDetail(data);
	}

	@PutMapping("/booking/detail/change/status/{bookingDetailId}")
	public void updateStatusChuaDaChangeToDaDa(@PathVariable("bookingDetailId") Integer bookingDetailId) {
		bookingDetailService.updateStatusChuaDaChangeToDaDa(bookingDetailId);
	}

	@PostMapping("/booking/detail/add/new")
	public void addNewBookingDetail(@RequestBody Map<String, Object> data) {
		bookingDetailService.addNewBookingDetail(data);
	}

	@GetMapping("/booking/detail/find/date/and/time/{date}/{time}/{sportFieldId}")
	public List<BookingDetail> findByDateAndTime(
			@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@PathVariable("time") String time, @PathVariable("sportFieldId") Integer sportFieldId) {
		return bookingDetailService.findByDateAndTime(date, time, sportFieldId);
	}

	@PostMapping("/payment/process/{bookingId}")
	public void processPayment(@PathVariable("bookingId") Integer bookingId, @RequestParam double totalAmount) {
//		transactionService.createTransactionByPaymentBooking(bookingId, totalAmount);
		transactionService.createTransactionUserByPaymentBooking(bookingId, totalAmount);
		transactionService.createTransactionOwnerByPaymentBooking(bookingId, totalAmount);
	}

	@GetMapping("/booking/detail/tableCustomer/byFullname/{fullname}")
	public List<Booking> findByFullName(@PathVariable("fullname") String fullname) {
		return bookingService.findByFullNameOffline(fullname);
	}

	@GetMapping("/booking/rank/customer/online/byOwerId/{ownerId}")
	public List<Object[]> findBookingByOwnerIdExcludingUsernameOffline(@PathVariable("ownerId") Integer ownerId) {
		return bookingService.findBookingByOwnerIdExcludingUsernameOffline(ownerId);
	}

	@GetMapping("/booking/rank/customer/online/{username}")
	public List<Booking> findBookingByUsernameOnline(@PathVariable("username") String username) {
		return bookingService.findByUsername(username);
	}

	@GetMapping("/count/booking/{ownerId}")
	public Integer getCountBookingByOwnerId(@PathVariable("ownerId") Integer ownerId) {
		return bookingService.getCountBookingByOwnerId(ownerId);
	}
}
