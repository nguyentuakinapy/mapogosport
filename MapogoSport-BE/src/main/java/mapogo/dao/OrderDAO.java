package mapogo.dao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.CategoryProduct;
import mapogo.entity.Order;

public interface OrderDAO extends JpaRepository<Order, Integer> {
	List<Order> findByUser_Username(String username);

	// 1. Lọc theo ngày hôm nay
	@Query("SELECT o FROM Order o WHERE o.date = CURRENT_DATE")
	List<Order> findOrdersToday();

	// list order hom qua
	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :startOfYesterday AND :endOfYesterday "
			+ "AND o.status IN :statuses")
	List<Order> findByDateBetweenAndStatus(@Param("startOfYesterday") LocalDateTime startOfYesterday,
			@Param("endOfYesterday") LocalDateTime endOfYesterday, @Param("statuses") List<String> statuses);

	// 2. Lọc theo 7 ngày gần đây
	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :sevenDaysAgo AND CURRENT_DATE " + "AND o.status IN :statuses")
	List<Order> findOrdersLast7Days(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo,
			@Param("statuses") List<String> statuses);

	// 3. Lọc theo 1 tháng gần đây
	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :oneMonthAgo AND CURRENT_DATE AND o.status IN :statuses")
	List<Order> findOrdersLastMonth(@Param("oneMonthAgo") LocalDateTime oneMonthAgo,
			@Param("statuses") List<String> statuses);

//	// 4. Lọc theo khoảng ngày tùy chọn
//	@Query("SELECT o FROM Order o WHERE (:date IS NULL OR o.date = :date) OR (o.date BETWEEN :startDate AND :endDate)")
//	List<Order> findOrdersBetweenDates(@Param("date") LocalDateTime date, 
//	                        @Param("startDate") LocalDateTime startDate, 
//	                        @Param("endDate") LocalDateTime endDate);

	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :startOfDay AND :endOfDay AND o.status IN :statuses")
	List<Order> getOrdersForSingleDate(@Param("startOfDay") LocalDateTime startOfDay,
			@Param("endOfDay") LocalDateTime endOfDay, @Param("statuses") List<String> statuses);

	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :startDate AND :endDate AND o.status IN :statuses")
	List<Order> getOrdersBetweenDates(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, @Param("statuses") List<String> statuses);

	// total amout category to day
	@Query("SELECT cp.categoryProductId, cp.name, cp.image, SUM(o.amount) " + "FROM CategoryProduct cp "
			+ "JOIN cp.products p " + "JOIN p.productDetails pd " + "JOIN pd.productDetailSizes pds "
			+ "JOIN pds.orderDetails od " + "JOIN od.order o "
			+ "WHERE o.date = CURRENT_DATE AND o.status IN :statuses "
			+ "GROUP BY cp.categoryProductId, cp.name, cp.image")
	List<Object[]> findCategoryProductTotalsTodayWithStatus(@Param("statuses") List<String> statuses);

	// total amout category yesterday
	@Query("SELECT cp.categoryProductId, cp.name, cp.image, SUM(o.amount) " + "FROM CategoryProduct cp "
			+ "JOIN cp.products p " + "JOIN p.productDetails pd " + "JOIN pd.productDetailSizes pds "
			+ "JOIN pds.orderDetails od " + "JOIN od.order o "
			+ "WHERE o.date >= :startDate AND o.date < :endDate AND o.status IN :statuses "
			+ "GROUP BY cp.categoryProductId, cp.name, cp.image")
	List<Object[]> findCategoryProductTotalsYesterdayWithStatus(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, @Param("statuses") List<String> statuses);

	// total amout category 7 day
	@Query("SELECT cp.categoryProductId, cp.name, cp.image, SUM(o.amount) " + "FROM CategoryProduct cp "
			+ "JOIN cp.products p " + "JOIN p.productDetails pd " + "JOIN pd.productDetailSizes pds "
			+ "JOIN pds.orderDetails od " + "JOIN od.order o "
			+ "WHERE o.date BETWEEN :startDate AND CURRENT_DATE AND o.status IN :statuses "
			+ "GROUP BY cp.categoryProductId, cp.name, cp.image")
	List<Object[]> findCategoryProductTotalsLast7DaysWithStatus(@Param("startDate") LocalDateTime startDate,
			@Param("statuses") List<String> statuses);

	// total amount category for a specific day
	@Query("SELECT cp.categoryProductId, cp.name, cp.image, SUM(o.amount) " +
	       "FROM CategoryProduct cp " +
	       "JOIN cp.products p " +
	       "JOIN p.productDetails pd " +
	       "JOIN pd.productDetailSizes pds " +
	       "JOIN pds.orderDetails od " +
	       "JOIN od.order o " +
	       "WHERE o.date BETWEEN :startOfDay AND :endOfDay AND o.status IN :statuses " +
	       "GROUP BY cp.categoryProductId, cp.name, cp.image")
	List<Object> findCategoryProductTotalsByDateAndStatus(
	    @Param("startOfDay") LocalDateTime startOfDay,
	    @Param("endOfDay") LocalDateTime endOfDay,
	    @Param("statuses") List<String> statuses
	);

	// total amount category between two dates
	@Query("SELECT cp.categoryProductId, cp.name, cp.image, SUM(o.amount) " +
	       "FROM CategoryProduct cp " +
	       "JOIN cp.products p " +
	       "JOIN p.productDetails pd " +
	       "JOIN pd.productDetailSizes pds " +
	       "JOIN pds.orderDetails od " +
	       "JOIN od.order o " +
	       "WHERE o.date BETWEEN :startDate AND :endDate AND o.status IN :statuses " +
	       "GROUP BY cp.categoryProductId, cp.name, cp.image")
	List<Object> findCategoryProductTotalsByBetweenAndStatus(
	    @Param("startDate") LocalDateTime startDate,
	    @Param("endDate") LocalDateTime endDate,
	    @Param("statuses") List<String> statuses
	);


}
