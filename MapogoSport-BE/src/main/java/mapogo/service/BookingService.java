package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Order;

public interface BookingService {
	
	List<Booking> findAll();
	
	List<Map<String, Object>> findBookingByUsername(String username);
	List<Map<String, Object>> findAllBooking();
	Order updateStatusBooking(Map<String, Object> bookingData);
	
	List<Booking> findById(Integer id);
	
	Booking createBooking(Map<String, Object> booking);
	
	List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status);
	
//	Double findRevenueByDate(Integer ownerId, Integer flag, String startDate, String endDate);
	
	List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds, Integer ownerId);

	List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds);
	
}
