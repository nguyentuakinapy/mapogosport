package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.entity.Booking;
import mapogo.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService{
	
	@Autowired
	BookingDAO bookingDAO;

	@Override
	public List<Booking> findAll() {
		return bookingDAO.findAll();
	}

}
