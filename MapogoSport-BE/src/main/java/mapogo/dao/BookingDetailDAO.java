package mapogo.dao;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import mapogo.entity.BookingDetail;

@Repository
public interface BookingDetailDAO extends JpaRepository<BookingDetail, Integer> {
	BookingDetail findByBooking_BookingId(Integer bookingId);

//	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId AND b.date = CURRENT_DATE")
//	List<BookingDetail> findBySportFieldDetailAndToday(@Param("sportFieldDetailId") Integer sportFieldDetailId);

	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId AND b.date BETWEEN :startDate AND :endDate")
	List<BookingDetail> findBySportFieldDetailAndDateBetween(@Param("sportFieldDetailId") Integer sportFieldDetailId,
			@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
	
	@Query("SELECT b FROM BookingDetail b WHERE b.sportFieldDetail.sportFielDetailId = :sportFieldDetailId AND b.date = :date")
	List<BookingDetail> findBySportFieldDetailAndDay(@Param("sportFieldDetailId") Integer sportFieldDetailId,@Param("date") LocalDate date);
}
