package mapogo.dao;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import mapogo.entity.BookingDetail;

@Repository
public interface BookingDetailDAO extends JpaRepository<BookingDetail, Integer> {
	List<BookingDetail> findByBooking_BookingId(Integer bookingId);

//	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId AND b.date = CURRENT_DATE")
//	List<BookingDetail> findBySportFieldDetailAndToday(@Param("sportFieldDetailId") Integer sportFieldDetailId);

	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId AND b.status != :status AND b.date BETWEEN :startDate AND :endDate")
	List<BookingDetail> findBySportFieldDetailAndDateBetween(@Param("sportFieldDetailId") Integer sportFieldDetailId,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") String status);

	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId  AND b.status != :status AND b.date = :date")
	List<BookingDetail> findBySportFieldDetailAndDay(@Param("sportFieldDetailId") Integer sportFieldDetailId,
			@Param("date") LocalDate date, @Param("status") String status);

	@Query("SELECT b FROM BookingDetail b WHERE b.startTime = :startTime AND b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId  AND b.status != :status AND b.date = :date")
	BookingDetail findBookingDetailByStartTimeAndSportDetailId(@Param("startTime") String startTime,
			@Param("sportFieldDetailId") Integer sportDetailId, @Param("date") LocalDate date,  @Param("status") String status);

	@Query("SELECT b FROM BookingDetail b WHERE b.status != :status AND b.subscriptionKey = :subscriptionKey")
	List<BookingDetail> findBookingDetailBySubscriptionKey(
			@Param("subscriptionKey") String subcriptionKey,  @Param("status") String status);
	
	@Query("SELECT b FROM BookingDetail b WHERE b.subscriptionKey = :subscriptionKey")
	List<BookingDetail> findBySubscriptionKey(@Param("subscriptionKey") String subscriptionKey);
	
	@Query("SELECT b FROM BookingDetail b WHERE b.date = :date and b.startTime = :time and b.sportFieldDetail.sportField.sportFieldId = :sportFieldId")
	List<BookingDetail> findByDateAndTime(@Param("date") LocalDate date, @Param("time") String time, @Param("sportFieldId") Integer sportFieldId);;
}
