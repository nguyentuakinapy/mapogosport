package mapogo.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDetailDAO;
import mapogo.entity.BookingDetail;
import mapogo.service.BookingDetailService;

@Service
public class BookingDetailServiceImpl implements BookingDetailService {

	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Override
	public List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId) {
		return bookingDetailDAO.findBySportFieldDetailAndToday(sportDetailId);
	}

	public List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportFieldDetailId) {

		LocalDate today = LocalDate.now();
		LocalDate endDate = today.plusDays(7);

		return bookingDetailDAO.findBySportFieldDetailAndDateBetween(sportFieldDetailId, today, endDate);
	}

	@Override
	public BookingDetail createBookingDetail(BookingDetail bookingDetail) {
		return bookingDetailDAO.save(bookingDetail);
	}

}
