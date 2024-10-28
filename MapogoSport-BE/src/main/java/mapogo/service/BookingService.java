package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.Booking;

public interface BookingService {
	
	List<Booking> findAll();
	
	List<Booking> findByUser_Username(String username);
	
	List<Booking> findById(Integer id);
	
	Booking createBooking(Map<String, Object> booking);
	
	Double findTotalAmountByOwnerAndStatus(Integer ownerId);
	
	Double findRevenueByDate(Integer ownerId, Integer flag, String startDate, String endDate);
}
