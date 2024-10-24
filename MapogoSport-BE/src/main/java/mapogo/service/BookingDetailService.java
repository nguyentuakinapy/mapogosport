package mapogo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import mapogo.entity.BookingDetail;

public interface BookingDetailService {

	List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId);

	List<BookingDetail> findBySportFieldDetailAndDay(Integer sportDetailId, LocalDate date);

	List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportDetailId, LocalDate today, LocalDate endDate);

	BookingDetail createBookingDetail(Map<String, Object> bd);
}
