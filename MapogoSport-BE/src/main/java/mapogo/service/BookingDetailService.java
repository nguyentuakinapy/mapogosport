package mapogo.service;

import java.util.List;
import java.util.Map;

import mapogo.entity.BookingDetail;

public interface BookingDetailService {

	List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId);

	List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportDetailId);

	BookingDetail createBookingDetail(Map<String, Object> bd);
}
