package mapogo.service;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import mapogo.dto.PaymentDTO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Order;

public interface BookingService {
	
	List<Booking> findAll();
	
	List<Map<String, Object>> findBookingByUsername(String username);
	List<Map<String, Object>> findAllBookingByOwner(String ownerUsername);
	Booking updateStatusBooking(Map<String, Object> bookingData);
	
	Booking createBooking(Map<String, Object> booking);
	
	List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status);
	
	List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds, List<Integer> bookingId, List<String> status);

	List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds, List<Integer> bookingId, List<String> status);
	
	List<BookingDetail> findBookingDetailBySportFieldId(Integer sportFieldDetailIds, List<Integer> bookingId, List<String> status);
	
	//Revenue by Date
	
	List<Booking> findRevenueByDate(String status,Integer ownerId, String startDate, String endDate);
	
	List<BookingDetail> findBookingDetailByDate(List<Integer> sportFielDetailIds, List<Integer> bookingId, List<String> status, String startDate, String endDate);
	
	List<Object[]> findRevenueBySportFieldDetailIdsByDate(List<Integer> sportFieldDetailIds, List<Integer> bookingId, List<String> status, String startDate, String endDate);
	
	//Chart Customer
	
	Integer totalCustomer(Integer ownerId);
	
	Map<Integer, Integer> findCustomerCountsByMonth(Integer year, Integer ownerId);
	
	List<Object[]> findBookingByOwnerIdUsernameOffline(Integer ownerId);
	
	List<Object[]> findBookingByOwnerIdExcludingUsernameOffline(Integer ownerId);
	
	List<Booking> findByFullNameOffline(String fullName);
	
	List<Booking> findByUsername(String username);
	
	Integer getCountBookingByOwnerId(Integer ownerId);
	
	//của Mỵ từ đây
	PaymentDTO createPaymentVNPay(Map<String, Object> data, HttpServletRequest req) throws UnsupportedEncodingException;
	
	
	
	//đến đây
}
