package mapogo.service.impl;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TimeZone;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.PaymentMethodDAO;
import mapogo.dao.TransactionDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.VoucherDAO;
import mapogo.dao.WalletDAO;
import mapogo.dto.MoMoPaymentResponse;
import mapogo.dto.PaymentDTO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Notification;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.Owner;
import mapogo.entity.PaymentMethod;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Voucher;
import mapogo.entity.Wallet;
import mapogo.service.BookingService;
import mapogo.service.PaymentMethodService;
import mapogo.utils.Config;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	BookingDAO bookingDAO;

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	PaymentMethodDAO paymentMethodDAO;

	@Autowired
	OwnerDAO ownerDAO;

	@Autowired
	VoucherDAO voucherDAO;

	@Autowired
	NotificationDAO notificationDAO;

	@Autowired
	TransactionDAO transactionDAO;

	@Autowired
	WalletDAO walletDAO;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Override
	public List<Booking> findAll() {
		return bookingDAO.findAll();
	}

	@Override
	public List<Map<String, Object>> findAllBookingByOwner(String ownerUsername) {
		List<Booking> bookings = bookingDAO.findByOwner_User_Username(ownerUsername);
		List<Map<String, Object>> resultList = new ArrayList<>();

		for (Booking booking : bookings) {
			Map<String, Object> bookingMap = new HashMap<>();
			bookingMap.put("bookingId", booking.getBookingId());
			bookingMap.put("bookingUserFullname", booking.getFullName());
			bookingMap.put("date", booking.getDate());
			bookingMap.put("totalAmount", booking.getTotalAmount());
			bookingMap.put("status", booking.getStatus());
			bookingMap.put("bookingUserPhone", booking.getPhoneNumber());
			bookingMap.put("percentDeposit", booking.getPercentDeposit());

			for (BookingDetail bookingDetail : booking.getBookingDetails()) {
				if (bookingDetail.getSportFieldDetail() != null) {
					SportField sportField = bookingDetail.getSportFieldDetail().getSportField();
					if (sportField != null) {
						bookingMap.put("sportFieldName", sportField.getName());
					}
				}
			}

			Map<String, Object> userMap = new HashMap<>();
			if (booking.getUser() != null) {
				userMap.put("username", booking.getUser().getUsername());
				userMap.put("fullname", booking.getUser().getFullname());
			}

			bookingMap.put("user", userMap);
			resultList.add(bookingMap);
		}
		return resultList;
	}

	@Override
	public List<Map<String, Object>> findBookingByUsername(String username) {
		List<Booking> bookings = bookingDAO.findByUser_Username(username);
		List<Map<String, Object>> resultList = new ArrayList<>();

		for (Booking booking : bookings) {
			Map<String, Object> bookingMap = new HashMap<>();
			bookingMap.put("bookingId", booking.getBookingId());
			bookingMap.put("date", booking.getDate());
			bookingMap.put("totalAmount", booking.getTotalAmount());
			bookingMap.put("status", booking.getStatus());
			bookingMap.put("percentDeposit", booking.getPercentDeposit());

			List<Map<String, Object>> bookingDetailsList = new ArrayList<>();
			for (BookingDetail bookingDetail : booking.getBookingDetails()) {
				Map<String, Object> bookingDetailMap = new HashMap<>();
				bookingDetailMap.put("bookingDetailStatus", bookingDetail.getStatus());
				bookingDetailMap.put("price", bookingDetail.getPrice());
				bookingDetailMap.put("bookingDetailDate", bookingDetail.getDate());
				bookingDetailMap.put("startTime", bookingDetail.getStartTime());

				SportField sportField = bookingDetail.getSportFieldDetail().getSportField();
				if (sportField != null) {
					bookingMap.put("sportFieldName", sportField.getName());
				}

				bookingDetailsList.add(bookingDetailMap);
			}

			bookingMap.put("bookingDetails", bookingDetailsList);
			resultList.add(bookingMap);
		}
		return resultList;
	}

	@Override
	public Booking updateStatusBooking(Map<String, Object> bookingData) {
		Integer bookingId = (Integer) bookingData.get("bookingId");
		String newStatus = (String) bookingData.get("status");
		Integer refundAmount = (Integer) bookingData.get("refundAmount");

		Optional<Booking> optionalBooking = bookingDAO.findById(bookingId);
		if (optionalBooking.isPresent()) {
			Booking booking = optionalBooking.get();
			booking.setStatus(newStatus);
			if (newStatus.equals("Đã hủy")) {
				for (BookingDetail bookingDetail : booking.getBookingDetails()) {
					if (bookingDetail.getStatus().equals("Chưa bắt đầu")) {
						bookingDetail.setStatus(newStatus);
						bookingDetailDAO.save(bookingDetail);
					}
				}
				Wallet wallet = booking.getUser().getWallet();
				wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(refundAmount)));

				Transaction transaction = new Transaction();
				transaction.setAmount(BigDecimal.valueOf(refundAmount));
				transaction.setCreatedAt(LocalDateTime.now());
				transaction.setDescription("Hoàn tiền từ bookingId - " + bookingId);
				transaction.setTransactionType("+" + refundAmount);
				transaction.setWallet(wallet);

				transactionDAO.save(transaction);
				walletDAO.save(wallet);

//				Owner owner = ownerDAO.findById(booking.getOwner().getOwnerId()).get();
//				Wallet walletOwner = owner.getUser().getWallet();
//				if (walletOwner != null) {
//					walletOwner.setBalance(walletOwner.getBalance().add(BigDecimal.valueOf(refundAmount)));
//					
//					Transaction transaction = new Transaction();
//					transaction.setAmount(BigDecimal.valueOf(refundAmount));
//					transaction.setCreatedAt(LocalDateTime.now());
//					transaction.setDescription("Hoàn tiền từ bookingId - " + bookingId);
//					transaction.setTransactionType("+" + refundAmount);
//					transaction.setWallet(walletUser);
//					
//					transactionDAO.save(transaction);
//					walletDAO.save(walletUser);
//				}
			}
			bookingDAO.save(booking);
		}
		return null;
	}

	@Override
	public Booking createBooking(Map<String, Object> b) {
		System.err.println(b);

		Booking booking = new Booking();

		User u = userDAO.findById((String) b.get("username")).get();
		PaymentMethod p = paymentMethodDAO.findById((Integer) b.get("paymentMethodId")).get();
		Owner o = ownerDAO.findById((Integer) b.get("ownerId")).get();
		Voucher v = null;
		if (b.get("voucher") != null) {
			v = voucherDAO.findById(Integer.parseInt((String) b.get("voucher"))).get();
		}

		Object totalAmountObj = b.get("totalAmount");
		Double totalAmount;

		if (totalAmountObj instanceof String) {
			totalAmount = Double.valueOf((String) totalAmountObj);
		} else if (totalAmountObj instanceof Number) {
			totalAmount = ((Number) totalAmountObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		booking.setUser(u);
		booking.setTotalAmount(totalAmount);
		booking.setPaymentMethod(p);
		booking.setOwner(o);
		booking.setStatus((String) b.get("status"));
		booking.setVoucher(null);
		booking.setNote((String) b.get("note"));
		booking.setFullName((String) b.get("fullName"));
		booking.setPhoneNumber((String) b.get("phoneNumber"));
		booking.setPercentDeposit(Integer.parseInt(String.valueOf(b.get("percentDeposit"))));
		booking.setOldTotamAmount(0);
		bookingDAO.save(booking);

		if (((String) b.get("checkOwner")).equals("user")) {
			Notification n = new Notification();
			n.setUser(o.getUser());
			n.setTitle("Đặt sân mới");
			n.setMessage(u.getFullname() + " Vừa đặt sân.");
			n.setType("info");
			n.setBooking(booking);
			notificationDAO.save(n);

			messagingTemplate.convertAndSend("/topic/bookingDetail", booking.getOwner().getUser().getUsername());
			messagingTemplate.convertAndSend("/topic/bookingDetail/reload", booking.getOwner().getUser().getUsername());
		}

		return booking;
//		return null;
	}

	@Override
	public List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerAndStatus(ownerId, status);
	}

	@Override
	public List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds, List<Integer> bookingId,
			List<String> status) {
		// TODO Auto-generated method stub
		return bookingDAO.findRevenueBySportFieldDetailIds(sportFieldDetailIds, bookingId, status);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySportFieldId(Integer sportFieldDetailIds, List<Integer> bookingId,
			List<String> status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingDetailBySportFieldId(sportFieldDetailIds, bookingId, status);
	}

	@Override
	public List<Booking> findRevenueByDate(String status, Integer ownerId, String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		System.out.println(sqlStartDate);
		return bookingDAO.findRevenueByDate(status, ownerId, sqlStartDate, sqlEndDate);
	}

	@Override
	public List<BookingDetail> findBookingDetailByDate(List<Integer> sportFielDetailIds, List<Integer> bookingId,
			List<String> status, String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findBookingDetailByDate(sportFielDetailIds, bookingId, status, sqlStartDate, sqlEndDate);
	}

	@Override
	public List<Object[]> findRevenueBySportFieldDetailIdsByDate(List<Integer> sportFieldDetailIds,
			List<Integer> bookingId, List<String> status, String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findRevenueBySportFieldDetailIdsByDate(sportFieldDetailIds, bookingId, status, sqlStartDate,
				sqlEndDate);
	}

	@Override
	public Integer totalCustomer(Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.totalCustomer(ownerId);
	}

	@Override
	public Map<Integer, Integer> findCustomerCountsByMonth(Integer year, Integer ownerId) {
		List<Object[]> results = bookingDAO.findCustomerCountsByMonth(year, ownerId);

		// Khởi tạo Map với 12 tháng
		Map<Integer, Integer> customerCountsByMonth = new HashMap<>();
		for (int i = 1; i <= 12; i++) {
			customerCountsByMonth.put(i, 0);
		}

		// Cập nhật Map với dữ liệu
		for (Object[] result : results) {
			Integer month = (Integer) result[0];
			Long count = (Long) result[1];
			customerCountsByMonth.put(month, count.intValue());
		}
		return customerCountsByMonth;
	}

	@Override
	public List<Object[]> findBookingByOwnerIdUsernameOffline(Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerIdUsernameOffline(ownerId);

	}

	@Override
	public List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds,
			List<Integer> bookingId, List<String> status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingDetailBySportFieldIdsAndOwner(sportFielDetailIds, bookingId, status,
				"Đã thanh toán");
	}

	@Override
	public List<Booking> findByFullNameOffline(String fullName) {
		// TODO Auto-generated method stub
		return bookingDAO.findByFullNameOffline(fullName);
	}

	@Override
	public List<Object[]> findBookingByOwnerIdExcludingUsernameOffline(Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerIdExcludingUsernameOffline(ownerId);
	}

	@Override
	public List<Booking> findByUsername(String username) {
		// TODO Auto-generated method stub
		return bookingDAO.findByUser_Username(username);
	}

	@Override
	public Integer getCountBookingByOwnerId(Integer ownerId) {
		Owner o = ownerDAO.findById(ownerId).get();
		return o.getBookings().size();
	}

	// của Mỵ từ đây
	@Autowired
	PaymentMethodService payService;
	@Override
	public PaymentDTO createPaymentVNPay(Map<String, Object> data, HttpServletRequest req)
			throws UnsupportedEncodingException {
		PaymentDTO paymentDTO = new PaymentDTO();
		String status = (String) data.get("status");
		double totalAmount;
	    double percentDeposit;

	    // Lấy giá trị và xử lý kiểu dữ liệu an toàn
	    if (data.get("totalAmount") instanceof Number) {
	        totalAmount = ((Number) data.get("totalAmount")).doubleValue();
	    } else {
	        totalAmount = Double.parseDouble(data.get("totalAmount").toString());
	    }

	    if (data.get("percentDeposit") instanceof Number) {
	        percentDeposit = ((Number) data.get("percentDeposit")).doubleValue();
	    } else {
	        percentDeposit = Double.parseDouble(data.get("percentDeposit").toString());
	    }

	    // Tính toán Amount
	    double Amount;
	    if ("Chờ thanh toán".equalsIgnoreCase(status)) {
	        Amount = totalAmount * (percentDeposit/100);
	    } else {
	        Amount = totalAmount;
	    }
	    
		// vnpay
		if (data.get("paymentMethodName").equals("VNPay")) {
			String orderType = "other";
			long amount = (long) (Amount * 100);
			String vnp_TxnRef = LocalDateTime.now().toString();
			String vnp_IpAddr = Config.getIpAddress(req);

			String vnp_TmnCode = Config.vnp_TmnCode;

			Map<String, String> vnp_Params = new HashMap<>();
			vnp_Params.put("vnp_Version", Config.vnp_Version);
			vnp_Params.put("vnp_Command", Config.vnp_Command);
			vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
			vnp_Params.put("vnp_Amount", String.valueOf(amount));
			vnp_Params.put("vnp_CurrCode", "VND");

			vnp_Params.put("vnp_BankCode", "NCB");

			vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
			vnp_Params.put("vnp_OrderInfo", String.valueOf( data.get("bookingId")));
													
			vnp_Params.put("vnp_OrderType", orderType);

			vnp_Params.put("vnp_Locale", "vn");
			vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/rest/booking/paymentInfo");
			
			vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

			Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
			String vnp_CreateDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

			cld.add(Calendar.MINUTE, 15);
			String vnp_ExpireDate = formatter.format(cld.getTime());
			vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

			List fieldNames = new ArrayList(vnp_Params.keySet());
			Collections.sort(fieldNames);
			StringBuilder hashData = new StringBuilder();
			StringBuilder query = new StringBuilder();
			Iterator itr = fieldNames.iterator();
			while (itr.hasNext()) {
				String fieldName = (String) itr.next();
				String fieldValue = (String) vnp_Params.get(fieldName);
				if ((fieldValue != null) && (fieldValue.length() > 0)) {
					// Build hash data
					hashData.append(fieldName);
					hashData.append('=');
					hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					// Build query
					query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
					query.append('=');
					query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
					if (itr.hasNext()) {
						query.append('&');
						hashData.append('&');
					}
				}
			}
			String queryUrl = query.toString();
			String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
			queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
			String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;

			// thành công
			paymentDTO.setStatus("ok");
			paymentDTO.setMessage("successfully");
			paymentDTO.setURL(paymentUrl);

		} else if (data.get("paymentMethod").equals("MoMo")) {
//			String info = data.get("accountPackageId") + "0" + data.get("userSubscriptionId");
//			System.out.println(info);
//			long amountBeforeDecimal = (long) Math.floor(accountPackage.getPrice());
//
//			ResponseEntity<String> response = paymentService.createMoMoPayment(String.valueOf(amountBeforeDecimal), 0,
//					info, "http://localhost:8080/rest/user/subscription/paymentInfo-momo");
//			ObjectMapper objectMapper = new ObjectMapper();
//			MoMoPaymentResponse momoResponse;
//			try {
//				momoResponse = objectMapper.readValue(response.getBody(), MoMoPaymentResponse.class);
//				String payUrl = momoResponse.getPayUrl();
//				paymentDTO.setURL(payUrl);
//				paymentDTO.setStatus("ok");
//				paymentDTO.setMessage("successfully");
//				return paymentDTO;
//			} catch (JsonProcessingException e) {
//				e.printStackTrace();
//			}
		}
		return paymentDTO;
	}
	// đến đây
}
