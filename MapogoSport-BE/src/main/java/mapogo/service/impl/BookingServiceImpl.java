package mapogo.service.impl;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.BookingDAO;
import mapogo.dao.OwnerDAO;
import mapogo.dao.PaymentMethodDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.VoucherDAO;
import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;
import mapogo.entity.Owner;
import mapogo.entity.PaymentMethod;
import mapogo.entity.User;
import mapogo.entity.Voucher;
import mapogo.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	BookingDAO bookingDAO;

	@Autowired
	UserDAO userDAO;

	@Autowired
	PaymentMethodDAO paymentMethodDAO;

	@Autowired
	OwnerDAO ownerDAO;

	@Autowired
	VoucherDAO voucherDAO;

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
	public Booking createBooking(Map<String, Object> b) {
		Booking booking = new Booking();

		User u = userDAO.findById((String) b.get("username")).get();
		PaymentMethod p = paymentMethodDAO.findById((Integer) b.get("paymentMethodId")).get();
		Owner o = ownerDAO.findById((Integer) b.get("ownerId")).get();
		Voucher v = null;
		if (((String) b.get("voucher")) != null) {
			v = voucherDAO.findById(Integer.parseInt((String) b.get("voucher"))).get();
		}

		Object totalAmountObj = b.get("totalAmount");
		Double totalAmount;

		if (totalAmountObj instanceof String) {
			totalAmount = Double.valueOf((String) totalAmountObj);
		} else if (totalAmountObj instanceof Number) {
			totalAmount = ((Number) totalAmountObj).doubleValue();
		} else {
			throw new IllegalArgumentException("totalAmount must be a String or Number");
		}

		booking.setUser(u);
		booking.setTotalAmount(totalAmount);
		booking.setPaymentMethod(p);
		booking.setOwner(o);
		booking.setStatus((String) b.get("status"));
		booking.setVoucher(v);
		booking.setNote((String) b.get("note"));
		return bookingDAO.save(booking);
	}
//
//	@Override
//	public Double findRevenueByDate(Integer ownerId, Integer flag, String startDate, String endDate) {
//		// TODO Auto-generated method stub
//		Date sqlStartDate = Date.valueOf(startDate);
//		Date sqlEndDate = Date.valueOf(endDate);
//		return bookingDAO.findRevenueByDate(ownerId, flag, sqlStartDate, sqlEndDate);
//	}



	@Override
	public List<Booking> findBookingAmountByOwnerAndStatus(Integer ownerId, String status) {
		// TODO Auto-generated method stub
		return bookingDAO.findBookingByOwnerAndStatus(ownerId, status);
	}

@Override
public List<BookingDetail> findBookingDetailBySportFieldAndOwner(List<Integer> sportFielDetailIds, Integer ownerId) {
	// TODO Auto-generated method stub
	return bookingDAO.findBookingDetailBySportFieldIdsAndOwner(sportFielDetailIds, ownerId);
}

@Override
public List<Object[]> findRevenueBySportFieldDetailIds(List<Integer> sportFieldDetailIds) {
	// TODO Auto-generated method stub
	return bookingDAO.findRevenueBySportFieldDetailIds(sportFieldDetailIds);
}



}
