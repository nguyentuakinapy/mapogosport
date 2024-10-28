package mapogo.dao;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Booking;

public interface BookingDAO extends JpaRepository<Booking, Integer>{
	List<Booking> findByUser_Username(String username);
	
	List<Booking> findByBookingId(Integer bookingId);
	
	@Query("SELECT SUM(b.totalAmount) " +
		       "FROM Booking b " +
		       "WHERE b.owner.ownerId = :ownerId AND b.status LIKE '%Thành công%'")
		Double findTotalAmountByOwnerAndStatus(@Param("ownerId") Integer ownerId); //Successful payment revenue

	@Query("SELECT SUM(b.totalAmount) " +
		       "FROM Booking b " +
		       "WHERE b.status LIKE '%Thành công%' " +
		       "AND b.owner.ownerId = :ownerId " +
		       "AND (" +
		       "    (1 = :flag AND CAST(b.date as DATE) = :startDate) " +
		       "    OR " +
		       "    (2 = :flag AND CAST(b.date as DATE) BETWEEN :startDate AND :endDate)" +
		       ")")
		Double findRevenueByDate(@Param("ownerId") Integer ownerId, 
		                        @Param("flag") Integer flag, 
		                        @Param("startDate") Date startDate, 
		                        @Param("endDate") Date endDate);

}
