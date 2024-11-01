package mapogo.dao;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;

public interface BookingDAO extends JpaRepository<Booking, Integer>{
	List<Booking> findByUser_Username(String username);
	
	List<Booking> findByBookingId(Integer bookingId);
	
	@Query("SELECT o " +
		       "FROM Booking o " +
		       "WHERE o.owner.ownerId = :ownerId AND TRIM(o.status) = :status")
		List<Booking> findBookingByOwnerAndStatus(@Param("ownerId") Integer ownerId, @Param("status") String status);



//	@Query("SELECT SUM(b.totalAmount) " +
//		       "FROM Booking b " +
//		       "WHERE b.status LIKE '%Thành công%' " +
//		       "AND b.owner.ownerId = :ownerId " +
//		       "AND (" +
//		       "    (1 = :flag AND CAST(b.date as DATE) = :startDate) " +
//		       "    OR " +
//		       "    (2 = :flag AND CAST(b.date as DATE) BETWEEN :startDate AND :endDate)" +
//		       ")")
//		Double findRevenueByDate(@Param("ownerId") Integer ownerId, 
//		                        @Param("flag") Integer flag, 
//		                        @Param("startDate") Date startDate, 
//		                        @Param("endDate") Date endDate);

	@Query("SELECT o FROM BookingDetail o WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds AND o.booking.owner.ownerId = :ownerId")
	List<BookingDetail> findBookingDetailBySportFieldIdsAndOwner(
	    @Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
	    @Param("ownerId") Integer ownerId);
	
	  @Query("SELECT o.sportFieldDetail.name, SUM(o.price) AS revenueField " +
	           "FROM BookingDetail o " +
	           "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds " +
	           "GROUP BY o.sportFieldDetail.sportFielDetailId,o.sportFieldDetail.name")
	    List<Object[]> findRevenueBySportFieldDetailIds(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds);
	}
