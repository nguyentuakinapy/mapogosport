package mapogo.service.impl;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.PaymentMethodDAO;
import mapogo.dao.TransactionDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.VoucherDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Notification;
import mapogo.entity.Order;
import mapogo.entity.Owner;
import mapogo.entity.PaymentMethod;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Voucher;
import mapogo.entity.Wallet;
import mapogo.service.BookingService;

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
		bookingDAO.save(booking);
		
		if (((String) b.get("checkOwner")).equals("user")) {
			Notification n = new Notification();
			n.setUser(o.getUser());
			n.setTitle("Đặt sân mới");
			n.setMessage(u.getFullname() + " Vừa đặt sân.");
			n.setType("info");
			n.setBooking(booking);
			notificationDAO.save(n);
			
			messagingTemplate.convertAndSend("/topic/bookingDetail", booking.getOwner().getOwnerId());
			messagingTemplate.convertAndSend("/topic/username", booking.getOwner().getUser().getUsername());
			messagingTemplate.convertAndSend("/topic/notification", booking.getOwner().getUser().getUsername());
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
	public List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds, List<Integer> bookingId, List<String> status) {
		// TODO Auto-generated method stub
		return bookingDAO.findRevenueBySportFieldDetailIds(sportFieldDetailIds, bookingId, status);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySportFieldId(Integer sportFieldDetailIds, List<Integer> bookingId, List<String> status) {
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
	public List<BookingDetail> findBookingDetailByDate(List<Integer> sportFielDetailIds, List<Integer> bookingId, List<String> status,
			String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findBookingDetailByDate(sportFielDetailIds, bookingId, status, sqlStartDate, sqlEndDate);
	}

	@Override
	public List<Object[]> findRevenueBySportFieldDetailIdsByDate(List<Integer> sportFieldDetailIds,  List<Integer> bookingId, List<String> status, String startDate,
			String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findRevenueBySportFieldDetailIdsByDate(sportFieldDetailIds, bookingId, status, sqlStartDate, sqlEndDate);
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
	public List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds, List<Integer> bookingId,
			List<String> status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingDetailBySportFieldIdsAndOwner(sportFielDetailIds, bookingId, status, "Đã thanh toán");
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

}
