package mapogo.service.impl;

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
	public BookingDetail findByBooking_BookingId(Integer bookingId) {
		return bookingDetailDAO.findByBooking_BookingId(bookingId);
	}

	@Override
	public List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId) {
		return bookingDetailDAO.findBySportFieldDetailAndToday(sportDetailId);
	}

}
