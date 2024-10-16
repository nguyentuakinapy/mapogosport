package mapogo.service;

import java.util.List;

import mapogo.entity.Booking;

public interface BookingService {
	
	List<Booking> findAll();
	
	List<Booking> findByUser_Username(String username);
	
	List<Booking> findById(Integer id);
}
