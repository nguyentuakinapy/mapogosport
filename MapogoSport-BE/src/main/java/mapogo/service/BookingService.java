package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Order;

public interface BookingService {
	
	List<Booking> findAll();
	
	List<Map<String, Object>> findBookingByUsername(String username);
	List<Map<String, Object>> findAllBookingByOwner(String ownerUsername);
	Order updateStatusBooking(Map<String, Object> bookingData);
	
	Booking createBooking(Map<String, Object> booking);
	
	List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status);
	
	List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds, Integer ownerId);

	List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds);
	
	List<BookingDetail> findBookingDetailBySportFieldId(Integer sportFieldDetailIds);
	
	//Revenue by Date
	
	List<Booking> findRevenueByDate(String status,Integer ownerId, String startDate, String endDate);
	
	List<BookingDetail> findBookingDetailByDate(List<Integer> sportFielDetailIds, Integer ownerId, String startDate, String endDate);
	
	List<Object[]> findRevenueBySportFieldDetailIdsByDate(List<Integer> sportFieldDetailIds, String startDate, String endDate);
	
	//Chart Customer
	
	Integer totalCustomer(Integer ownerId);
	
	Map<Integer, Integer> findCustomerCountsByMonth(Integer year, Integer ownerId);
	
	List<Object[]> findBookingByOwnerIdUsername(Integer ownerId);
	

}
