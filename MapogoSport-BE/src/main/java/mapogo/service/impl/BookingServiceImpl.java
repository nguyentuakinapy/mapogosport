package mapogo.service.impl;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.PaymentMethodDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.VoucherDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Order;
import mapogo.entity.Owner;
import mapogo.entity.PaymentMethod;
import mapogo.entity.PhoneNumber;
import mapogo.entity.PhoneNumberUser;
import mapogo.entity.SportField;
import mapogo.entity.User;
import mapogo.entity.Voucher;
import mapogo.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	BookingDAO bookingDAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	PaymentMethodDAO paymentMethodDAO;

	@Autowired
	OwnerDAO ownerDAO;

	@Autowired
	VoucherDAO voucherDAO;

	@Override
	public List<Booking> findAll() {
		return bookingDAO.findAll();
	}
	
	@Override
	public List<Map<String, Object>> findAllBooking() {
		List<Booking> bookings = bookingDAO.findAll();
		List<Map<String, Object>> resultList = new ArrayList<>();
		
		for (Booking booking: bookings) {
			Map<String, Object> bookingMap = new HashMap<>();
			bookingMap.put("bookingId", booking.getBookingId());
			bookingMap.put("userFullname", booking.getUser().getFullname());
			bookingMap.put("date", booking.getDate());
			bookingMap.put("totalAmount", booking.getTotalAmount());
			bookingMap.put("status", booking.getStatus());
			
			User user = booking.getUser();
			for (PhoneNumberUser phoneNumberUser : user.getPhoneNumberUsers()) {
                if (phoneNumberUser.getActive() != null && phoneNumberUser.getActive()) {
                    PhoneNumber phoneNumber = phoneNumberUser.getPhoneNumber();
                    if (phoneNumber != null) {
                        bookingMap.put("userPhone", phoneNumber.getPhoneNumber());
                    }
                }
            }
	        resultList.add(bookingMap);
		}
		return resultList;
	}

	@Override
	public List<Map<String, Object>> findBookingByUsername(String username) {
		List<Booking> bookings = bookingDAO.findByUser_Username(username);
		List<Map<String, Object>> resultList = new ArrayList<>();
		
		for (Booking booking: bookings) {
			Map<String, Object> bookingMap = new HashMap<>();
			bookingMap.put("bookingId", booking.getBookingId());
			bookingMap.put("date", booking.getDate());
			bookingMap.put("totalAmount", booking.getTotalAmount());
			bookingMap.put("status", booking.getStatus());
			
			for (BookingDetail bookingDetail : booking.getBookingDetails()) {
	            if (bookingDetail.getSportFieldDetail() != null) {
	                SportField sportField = bookingDetail.getSportFieldDetail().getSportField();
	                if (sportField != null) {
	                    bookingMap.put("sportFieldName", sportField.getName());
	                }
	            }
	        }
	        resultList.add(bookingMap);
		}
		return resultList;
	}
	

	@Override
	public Order updateStatusBooking(Map<String, Object> bookingData) {
		Integer bookingId = (Integer) bookingData.get("bookingId");
		String newStatus = (String) bookingData.get("status");
		
		Optional<Booking> optionalBooking = bookingDAO.findById(bookingId);
		if (optionalBooking.isPresent()) {
		    Booking booking = optionalBooking.get();
		    booking.setStatus(newStatus);
		    bookingDAO.save(booking);
		}
		return null;
	}

	@Override
	public List<Booking> findById(Integer id) {
		return bookingDAO.findByBookingId(id);
	}

	@Override
	public Booking createBooking(Map<String, Object> b) {
		Booking booking = new Booking();

		User u = userDAO.findById((String) b.get("username")).get();
		PaymentMethod p = paymentMethodDAO.findById((Integer) b.get("paymentMethodId")).get();
		Owner o = ownerDAO.findById((Integer) b.get("ownerId")).get();
		Voucher v = null;
		if (((String) b.get("voucher")) != null) {
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
		booking.setVoucher(v);
		booking.setNote((String) b.get("note"));
		return bookingDAO.save(booking);
	}

	@Override
	public List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerAndStatus(ownerId, status);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds,
			Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingDetailBySportFieldIdsAndOwner(sportFielDetailIds, ownerId);
	}

	@Override
	public List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds) {
		// TODO Auto-generated method stub
		return bookingDAO.findRevenueBySportFieldDetailIds(sportFieldDetailIds);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySportFieldId(Integer sportFieldDetailIds) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingDetailBySportFieldId(sportFieldDetailIds);
	}

	@Override
	public List<Booking> findRevenueByDate(String status, Integer ownerId, String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		System.out.println(sqlStartDate);
		return bookingDAO.findRevenueByDate(status, ownerId, sqlStartDate, sqlEndDate);
	}

	@Override
	public List<BookingDetail> findBookingDetailByDate(List<Integer> sportFielDetailIds, Integer ownerId,
			String startDate, String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findBookingDetailByDate(sportFielDetailIds, ownerId, sqlStartDate, sqlEndDate);
	}

	@Override
	public List<Object[]> findRevenueBySportFieldDetailIdsByDate(List<Integer> sportFieldDetailIds, String startDate,
			String endDate) {
		Date sqlStartDate = Date.valueOf(startDate);
		Date sqlEndDate = Date.valueOf(endDate);
		return bookingDAO.findRevenueBySportFieldDetailIdsByDate(sportFieldDetailIds, sqlStartDate, sqlEndDate);
	}

	@Override
	public Integer totalCustomer(Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.totalCustomer(ownerId);
	}

	@Override
	public Map<Integer, Integer> findCustomerCountsByMonth(Integer year, Integer ownerId) {
		List<Object[]> results = bookingDAO.findCustomerCountsByMonth(year, ownerId);
		
		//Khởi tạo Map với 12 tháng
		Map<Integer,Integer> customerCountsByMonth = new HashMap<>();
		for(int i = 1; i<=12; i++) {
			customerCountsByMonth.put(i, 0);
		}
			
		//Cập nhật Map với dữ liệu 
		for(Object[] result : results) {
			Integer month = (Integer) result[0];
			Long count = (Long) result[1];
			customerCountsByMonth.put(month, count.intValue());
		}
		return customerCountsByMonth;
	}

	@Override
	public List<Object[]> findBookingByOwnerIdUsername(Integer ownerId) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerIdUsername(ownerId);

	}

}
