package mapogo.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.SportFieldDAO;
import mapogo.dao.SportFieldDetailDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.SportFieldDetail;
import mapogo.service.BookingDetailService;

@Service
public class BookingDetailServiceImpl implements BookingDetailService {

	@Autowired
	BookingDetailDAO bookingDetailDAO;
	
	@Autowired
	BookingDAO bookingDAO;
	
	@Autowired
	SportFieldDetailDAO sportFieldDAO;

	@Override
	public List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId) {
		return bookingDetailDAO.findBySportFieldDetailAndToday(sportDetailId);
	}

	public List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportFieldDetailId, LocalDate today, LocalDate endDate) {

//		LocalDate today = LocalDate.now();
//		LocalDate endDate = today.plusDays(7);

		return bookingDetailDAO.findBySportFieldDetailAndDateBetween(sportFieldDetailId, today, endDate);
	}

	@Override
	public BookingDetail createBookingDetail(Map<String, Object> bd) {
		BookingDetail bookingDetail = new BookingDetail();
		
		SportFieldDetail spd = sportFieldDAO.findById((Integer) bd.get("sportFieldDetailId")).get();
		Booking b = bookingDAO.findById((Integer) bd.get("booking")).get();
		
		Object priceObj = bd.get("price");
		Double price;

		if (priceObj instanceof String) {
			price = Double.valueOf((String) priceObj);
		} else if (priceObj instanceof Number) {
			price = ((Number) priceObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}
		
		bookingDetail.setStartTime((String) bd.get("startTime"));
		bookingDetail.setEndTime((String) bd.get("endTime"));
		bookingDetail.setSportFieldDetail(spd);
		bookingDetail.setPrice(price);
		bookingDetail.setDate(LocalDate.parse((String) bd.get("date")));	
		bookingDetail.setBooking(b);

		return bookingDetailDAO.save(bookingDetail);
	}

	@Override
	public List<BookingDetail> findBySportFieldDetailAndDay(Integer sportDetailId, LocalDate date) {
		return bookingDetailDAO.findBySportFieldDetailAndDay(sportDetailId, date);
	}

}
