package mapogo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import mapogo.entity.BookingDetail;

public interface BookingDetailService {

	List<Map<String, Object>> findBookingDetailByBookingId(Integer bookingId);
	BookingDetail updateStatusBookingDetail(Map<String, Object> bookingDetailData);

//	List<BookingDetail> findBySportFieldDetailAndToday(Integer sportDetailId);

	List<BookingDetail> findBySportFieldDetailAndDay(Integer sportDetailId, LocalDate date);

	List<BookingDetail> findBySportFieldDetailAndNextWeek(Integer sportDetailId, LocalDate today, LocalDate endDate);

	List<BookingDetail> findBookingDetailBySubscriptionKey(String subscriptionKey);
	
	List<BookingDetail> findByDateAndTime(LocalDate date, String time, Integer sportFieldId);

	BookingDetail createBookingDetail(Map<String, Object> bd);

	BookingDetail findBookingDetailByStartTimeDateAndSportDetailId(String startTime, Integer sportFieldDetailId,
			LocalDate date);

	void cancelBookingDetail(Integer bookingDetailId, String note);
	
	void cancelBookingDetailBySubscription(Integer bookingDetailId, String subscriptionKey, String note);

	void updateBookingDetail(Map<String, Object> data);
	
	void updateStatusChuaDaChangeToDaDa(Integer bookingDetailId);
	
	void addNewBookingDetail(Map<String, Object> data);
}
