package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.entity.Booking;
import mapogo.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	BookingDAO bookingDAO;

	@Override
	public List<Booking> findAll() {
		return bookingDAO.findAll();
	}

	@Override
	public List<Booking> findByUser_Username(String username) {
		return bookingDAO.findByUser_Username(username);
	}

	@Override
	public List<Booking> findById(Integer id) {
		return bookingDAO.findByBookingId(id);
	}

	@Override
	public Booking createBooking(Booking booking) {
		return bookingDAO.save(booking);
	}

}
