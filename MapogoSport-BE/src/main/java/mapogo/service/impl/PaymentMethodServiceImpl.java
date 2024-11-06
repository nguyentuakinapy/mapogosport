package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.BookingDetailDAO;
import mapogo.dao.PaymentMethodDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.PaymentMethod;
import mapogo.service.PaymentMethodService;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

	@Autowired
	PaymentMethodDAO paymentMethodDAO;
	
	@Autowired
	BookingDAO bookingDAO;
	
	@Autowired
	BookingDetailDAO bookingDetailDAO;

	@Override
	public List<PaymentMethod> findAll() {
		return paymentMethodDAO.findAll();
	}

	@Override
	public PaymentMethod findByName(String name) {
		return paymentMethodDAO.findByName(name);
	}

	@Override
	public PaymentMethod findPaymentMethodByBookingDetailId(Integer bookingDetailid) {
		BookingDetail bd = bookingDetailDAO.findById(bookingDetailid).get();
		Booking b = bookingDAO.findByBookingDetails_BookingDetailId(bd.getBookingDetailId());
		return paymentMethodDAO.findByBookings_BookingId(b.getBookingId());
	}

}
