package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Booking;

public interface BookingDAO extends JpaRepository<Booking, Integer>{
	List<Booking> findByUser_Username(String username);
	
	List<Booking> findByBookingId(Integer bookingId);
}
