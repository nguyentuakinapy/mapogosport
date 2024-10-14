package mapogo.service;

import java.util.List;

import mapogo.entity.BookingDetail;

public interface BookingDetailService {
	BookingDetail findByBooking_BookingId(Integer bookingId);
}
