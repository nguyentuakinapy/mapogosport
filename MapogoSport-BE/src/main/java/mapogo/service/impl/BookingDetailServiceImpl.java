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
import mapogo.dao.UserDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.User;
import mapogo.service.BookingDetailService;

@Service
public class BookingDetailServiceImpl implements BookingDetailService {

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Autowired
	BookingDAO bookingDAO;

	@Autowired
	SportFieldDetailDAO sportFieldDAO;

	@Autowired
	UserDAO userDAO;

//	@Override
//	public List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId) {
//		return bookingDetailDAO.findBySportFieldDetailAndToday(sportDetailId);
//	}

	public List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportFieldDetailId, LocalDate today,
			LocalDate endDate) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findBySportFieldDetailAndDateBetween(sportFieldDetailId,
				today, endDate);
		bookingDetails.forEach(bd -> {
			User u = userDAO.findUserByBookingDetailId(bd.getBookingDetailId());
			bd.setFullName(u.getFullname());
		});
		return bookingDetails;
	}

	@Override
	public BookingDetail createBookingDetail(Map<String, Object> bd) {
		System.err.println(bd);

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
		bookingDetail.setSubcriptionKey((String) bd.get("subscriptionKey"));
		return bookingDetailDAO.save(bookingDetail);
//		return null;
	}

	@Override
	public List<BookingDetail> findBySportFieldDetailAndDay(Integer sportDetailId, LocalDate date) {
		List<BookingDetail> bookingDetails = bookingDetailDAO.findBySportFieldDetailAndDay(sportDetailId, date);
		bookingDetails.forEach(bd -> {
			User u = userDAO.findUserByBookingDetailId(bd.getBookingDetailId());
			bd.setFullName(u.getFullname());
		});
		return bookingDetails;
	}

	@Override
	public BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(String startTime, Integer sportFieldDetailId,
			LocalDate date) {
		return bookingDetailDAO.findBookingDetailByStartTimeAndSportDetailId(startTime, sportFieldDetailId, date);
	}

	@Override
	public void cancelBookingDetail(Integer bookingDetailId) {
		BookingDetail bd = bookingDetailDAO.findById(bookingDetailId).get();
		bd.setStatus(false);
		bookingDetailDAO.save(bd);
		Booking booking = bookingDAO.findById(bd.getBooking().getBookingId()).get();
		List<BookingDetail> bookingDetails = bookingDetailDAO.findByBooking_BookingId(booking.getBookingId());
		int index = 0;
		for (BookingDetail b : bookingDetails) {
			if (!b.getStatus()) {
				index++;
			}
		}
		if (index == bookingDetails.size()) {
			booking.setStatus("Đã hủy");
			bookingDAO.save(booking);
		}
	}

	@Override
	public void updateBookingDetail(Map<String, Object> data) {
		BookingDetail bd = bookingDetailDAO.findById((Integer) data.get("bookingDetailId")).get();
		SportFieldDetail spd = sportFieldDAO.findById((Integer) data.get("idSportDetail")).get();

		Object priceObj = data.get("price");
		Double price;

		if (priceObj instanceof String) {
			price = Double.valueOf((String) priceObj);
		} else if (priceObj instanceof Number) {
			price = ((Number) priceObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		bd.setSportFieldDetail(spd);
		bd.setDate(LocalDate.parse((String) data.get("dateBooking")));
		bd.setStartTime((String) data.get("startTimeBooking"));
		bd.setEndTime((String) data.get("endTimeBooking"));
		bd.setPrice(price);
//		System.err.println(data);
		bookingDetailDAO.save(bd);
	}

	@Override
	public List<BookingDetail> findBookingDetailBySubscriptionKey(String subscriptionKey) {
		return bookingDetailDAO.findBookingDetailBySubscriptionKey(subscriptionKey);
	}

	@Override
	public void cancelBookingDetailBySubscription(Integer bookingDetailId, String subscriptionKey) {
		List<BookingDetail> bookingDetailsSub = bookingDetailDAO.findBySubscriptionKey(subscriptionKey);
		BookingDetail bookingDetail = bookingDetailDAO.findById(bookingDetailId).get();

		Booking booking = bookingDAO.findById(bookingDetail.getBooking().getBookingId()).get();

		bookingDetailsSub.forEach(bd -> {
			bd.setStatus(false);
			bookingDetailDAO.save(bd);
		});

		booking.setStatus("Đã hủy");
		bookingDAO.save(booking);
	}
}
