package mapogo.dao;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.Booking;
import mapogo.entity.BookingDetail;

public interface BookingDAO extends JpaRepository<Booking, Integer> {
	List<Booking> findByUser_Username(String username);

	List<Booking> findByBookingId(Integer bookingId);

//	@Query("SELECT o " + "FROM Booking o " + "WHERE o.owner.ownerId = :ownerId AND TRIM(o.status) = :status ")
//	List<Booking> findBookingByOwnerAndStatus(@Param("ownerId") Integer ownerId, @Param("status") String status);

	@Query("SELECT o FROM BookingDetail o WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds AND o.booking.owner.ownerId = :ownerId")
	List<BookingDetail> findBookingDetailBySportFieldIdsAndOwner(
			@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds, @Param("ownerId") Integer ownerId);

	@Query("SELECT o.sportFieldDetail.name, SUM(o.price) AS revenueField, Min(o.date) as StarDate, Max(o.date) as EndDate,o.sportFieldDetail.sportFielDetailId "
			+ "FROM BookingDetail o " + "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds "
			+ "GROUP BY o.sportFieldDetail.sportFielDetailId,o.sportFieldDetail.name")
	List<Object[]> findRevenueBySportFieldDetailIds(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds);

	@Query("SELECT o from BookingDetail o Where o.sportFieldDetail.sportFielDetailId=:sportFieldDetailIds")
	List<BookingDetail> findBookingDetailBySportFieldId(@Param("sportFieldDetailIds") Integer sportFieldDetailIds);

	// Query revenue by date
	@Query("SELECT b " +
		       "FROM Booking b " +
		       "WHERE TRIM(b.status) = :status " +
		       "AND b.owner.ownerId = :ownerId " +
		       "AND CAST(b.date AS DATE) BETWEEN :startDate AND :endDate")
	List<Booking> findRevenueByDate(@Param("status") String status,
		                                @Param("ownerId") Integer ownerId, 
		                                @Param("startDate") Date startDate, 
		                                @Param("endDate") Date endDate);

	@Query("Select o from  BookingDetail o "+
		   "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds "+
		   "AND o.booking.owner.ownerId = :ownerId " +
		   "AND CAST(o.date AS DATE) BETWEEN :startDate AND :endDate")
	List<BookingDetail> findBookingDetailByDate(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
												@Param("ownerId") Integer ownerId,
												@Param("startDate") Date startDate, 
					                            @Param("endDate") Date endDate
												);
	
	Booking findByBookingDetails_BookingDetailId(Integer bookingDetailId);
	
	@Query("SELECT o " +
		       "FROM Booking o " +
		       "WHERE o.owner.ownerId = :ownerId AND TRIM(o.status) = :status")
		List<Booking> findBookingByOwnerAndStatus(@Param("ownerId") Integer ownerId, @Param("status") String status);
  
	@Query("SELECT o.sportFieldDetail.name, SUM(o.price) AS revenueField, Min(o.date) as StarDate, Max(o.date) as EndDate, o.sportFieldDetail.sportFielDetailId "
			+ "FROM BookingDetail o " 
			+ "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds "
			+ "AND CAST(o.date AS DATE) BETWEEN :startDate AND :endDate "
			+ "GROUP BY o.sportFieldDetail.sportFielDetailId,o.sportFieldDetail.name ")
	List<Object[]> findRevenueBySportFieldDetailIdsByDate(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
														  @Param("startDate") Date startDate, 
														  @Param("endDate") Date endDate);
		  
//	Data chart customer
	
	@Query("select count(distinct b.user.username) as TotalUsernames "
		       + "from Booking b "
		       + "where b.owner.ownerId = :ownerId")
		Integer totalCustomer(@Param("ownerId") Integer ownerId);


	@Query("SELECT FUNCTION('MONTH', b.date) AS month, COUNT(DISTINCT b.user.username) AS customerCount "
		       + "FROM Booking b "
		       + "WHERE FUNCTION('YEAR', b.date) = :year AND b.owner.ownerId = :ownerId "
		       + "GROUP BY FUNCTION('MONTH', b.date)")
	List<Object[]> findCustomerCountsByMonth(@Param("year") Integer year, @Param("ownerId") Integer ownerId);

	@Query("select count(b), b.user.username, b.user.fullname from Booking b " +
		       "where b.owner.ownerId = :ownerId " +
		       "group by b.user.username, b.user.fullname "
		       + "order by count(b) desc ")
	List<Object[]> findBookingByOwnerIdUsername(@Param("ownerId") Integer ownerId);
	


	
	
	
	
	
	
	
	
	
	
	
	
}