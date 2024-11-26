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

	List<Booking> findByOwner_User_Username(String ownerUsername);

	List<Booking> findByBookingId(Integer bookingId);

	@Query("SELECT o " + "FROM Booking o " + "WHERE o.owner.ownerId = :ownerId AND TRIM(o.status) = :status ")
	List<Booking> findBookingByOwnerAndStatus(@Param("ownerId") Integer ownerId, @Param("status") String status);

	@Query("SELECT o FROM BookingDetail o WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds AND o.booking.bookingId IN :bookingId AND o.status IN :status AND o.booking.status = :s ")
	List<BookingDetail> findBookingDetailBySportFieldIdsAndOwner(
			@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@Param("bookingId") List<Integer> bookingId, @Param("status") List<String> status, @Param("s") String s);

	@Query("SELECT o.sportFieldDetail.name, SUM(o.price) AS revenueField, Min(o.date) as StarDate, Max(o.date) as EndDate,o.sportFieldDetail.sportFielDetailId "
			+ "FROM BookingDetail o "
			+ "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds AND o.booking.bookingId IN :bookingId AND o.status IN :status "
			+ "GROUP BY o.sportFieldDetail.sportFielDetailId,o.sportFieldDetail.name ")
	List<Object[]> findRevenueBySportFieldDetailIds(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@Param("bookingId") List<Integer> bookingId, @Param("status") List<String> status);

	@Query("SELECT o from BookingDetail o Where o.sportFieldDetail.sportFielDetailId=:sportFieldDetailIds AND o.booking.bookingId IN :bookingId AND o.status IN :status ")
	List<BookingDetail> findBookingDetailBySportFieldId(@Param("sportFieldDetailIds") Integer sportFieldDetailIds,
			@Param("bookingId") List<Integer> bookingId, @Param("status") List<String> status);

	// Query revenue by date
	@Query("SELECT b " + "FROM Booking b " + "WHERE TRIM(b.status) = :status " + "AND b.owner.ownerId = :ownerId "
			+ "AND CAST(b.date AS DATE) BETWEEN :startDate AND :endDate")
	List<Booking> findRevenueByDate(@Param("status") String status, @Param("ownerId") Integer ownerId,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);

	@Query("Select o from  BookingDetail o " + "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds "
			+ "AND o.booking.bookingId IN :bookingId AND o.status IN :status "
			+ "AND CAST(o.date AS DATE) BETWEEN :startDate AND :endDate")
	List<BookingDetail> findBookingDetailByDate(@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@Param("bookingId") List<Integer> bookingId, @Param("status") List<String> status,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);

	Booking findByBookingDetails_BookingDetailId(Integer bookingDetailId);

	@Query("SELECT o.sportFieldDetail.name, SUM(o.price) AS revenueField, Min(o.date) as StarDate, Max(o.date) as EndDate, o.sportFieldDetail.sportFielDetailId "
			+ "FROM BookingDetail o " + "WHERE o.sportFieldDetail.sportFielDetailId IN :sportFieldDetailIds "
			+ "AND o.booking.bookingId IN :bookingId AND o.status IN :status "
			+ "AND CAST(o.date AS DATE) BETWEEN :startDate AND :endDate "
			+ "GROUP BY o.sportFieldDetail.sportFielDetailId,o.sportFieldDetail.name ")
	List<Object[]> findRevenueBySportFieldDetailIdsByDate(
			@Param("sportFieldDetailIds") List<Integer> sportFieldDetailIds,
			@Param("bookingId") List<Integer> bookingId, @Param("status") List<String> status,
			@Param("startDate") Date startDate, @Param("endDate") Date endDate);

	@Query("SELECT o from BookingDetail o Where o.sportFieldDetail.sportFielDetailId=:sportFieldDetailIds AND o.booking.bookingId IN :bookingId AND o.status IN :status "
			+ "AND CAST(o.date AS DATE) BETWEEN :startDate AND :endDate ")
	List<BookingDetail> findBookingDetailBySportFieldIdAndDate(
			@Param("sportFieldDetailIds") Integer sportFieldDetailIds, @Param("bookingId") List<Integer> bookingId,
			@Param("status") List<String> status, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

//	Data chart customer

	@Query("select count(distinct b.user.username) as TotalUsernames " + "from Booking b "
			+ "where b.owner.ownerId = :ownerId")
	Integer totalCustomer(@Param("ownerId") Integer ownerId);

	@Query("SELECT FUNCTION('MONTH', b.date) AS month, COUNT(DISTINCT b.user.username) AS customerCount "
			+ "FROM Booking b " + "WHERE FUNCTION('YEAR', b.date) = :year AND b.owner.ownerId = :ownerId "
			+ "GROUP BY FUNCTION('MONTH', b.date)")
	List<Object[]> findCustomerCountsByMonth(@Param("year") Integer year, @Param("ownerId") Integer ownerId);

	@Query("select count(b), b.user.username, b.fullName from Booking b "
			+ "where b.owner.ownerId = :ownerId And b.user.username='sportoffline' "
			+ "group by b.user.username, b.fullName " + "order by count(b) desc ")
	List<Object[]> findBookingByOwnerIdUsernameOffline(@Param("ownerId") Integer ownerId);

//	@Query("select count(b), b.user.username, b.fullName from Booking b " +
//		       "where b.owner.ownerId = :ownerId and b.user.username <> 'sportoffline' " +
//		       "group by b.user.username, b.fullName " +
//		       "order by count(b) desc")
	@Query("SELECT COUNT(b) AS totalBookings, b.user.username AS username, u.fullname AS fullname "
			+ "FROM Booking b JOIN b.user u "
			+ "WHERE b.owner.ownerId = :ownerId AND b.user.username <> 'sportoffline' "
			+ "GROUP BY b.user.username, u.fullname " + "ORDER BY COUNT(b) DESC")
	List<Object[]> findBookingByOwnerIdExcludingUsernameOffline(@Param("ownerId") Integer ownerId);

	@Query("select o from Booking o where o.user.username = 'sportoffline' and o.fullName = :fullName")
	List<Booking> findByFullNameOffline(@Param("fullName") String fullName);

//	@Query("select b.user.username, b.fullname, count(b) as bookingCount from Booking b "
//	        + "where b.owner.ownerId = :ownerId and b.user.username = 'sportoffline' "
//	        + "group by b.user.username, b.fullname order by bookingCount desc ")
//	List<Object[]> findBookingByOwnerIdUsernameOffline(@Param("ownerId") Integer ownerId);

}