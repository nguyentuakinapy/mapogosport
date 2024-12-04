package mapogo.dao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.CategoryProduct;
import mapogo.entity.Order;
import mapogo.entity.UserSubscription;

public interface OrderDAO extends JpaRepository<Order, Integer> {
	List<Order> findByUser_Username(String username);

	@Query("SELECT o FROM Order o WHERE o.date BETWEEN :startOfToday AND :endOfToday AND o.status IN :statuses")
	List<Order> findOrdersToday(@Param("startOfToday") LocalDateTime startOfToday,
			@Param("endOfToday") LocalDateTime endOfToday, @Param("statuses") List<String> statuses);

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
	@Query("WITH CleanedOrders AS (" +
		       "SELECT DISTINCT o.orderId AS orderId, cp.categoryProductId AS categoryProductId, " +
		       "cp.name AS name, cp.image AS image, o.amount AS amount " +
		       "FROM Order o " +
		       "JOIN o.orderDetails od " +
		       "JOIN od.productDetailSize pds " +
		       "JOIN pds.productDetail pd " +
		       "JOIN pd.product p " +
		       "JOIN p.categoryProduct cp " +
		       " WHERE o.date >= :startDate AND o.date < :endDate AND o.status IN :statuses" +
		       ") " +
		       "SELECT co.categoryProductId, co.name, co.image, SUM(co.amount) AS totalAmount " +
		       "FROM CleanedOrders co " +
		       "GROUP BY co.categoryProductId, co.name, co.image")
		List<Object[]> findCategoryProductTotalsTodayWithStatus(
		    @Param("startDate") LocalDateTime startDate,
		    @Param("endDate") LocalDateTime endDate,
		    @Param("statuses") List<String> statuses
		);


	@Query("WITH CleanedOrders AS (" +
		       "SELECT DISTINCT o.orderId AS orderId, cp.categoryProductId AS categoryProductId, " +
		       "cp.name AS name, cp.image AS image, o.amount AS amount " +
		       "FROM Order o " +
		       "JOIN o.orderDetails od " +
		       "JOIN od.productDetailSize pds " +
		       "JOIN pds.productDetail pd " +
		       "JOIN pd.product p " +
		       "JOIN p.categoryProduct cp " +
		       " WHERE o.date >= :startDate AND o.date < :endDate AND o.status IN :statuses" +
		       ") " +
		       "SELECT co.categoryProductId, co.name, co.image, SUM(co.amount) AS totalAmount " +
		       "FROM CleanedOrders co " +
		       "GROUP BY co.categoryProductId, co.name, co.image")
		List<Object[]> findCategoryProductTotalsYesterdayWithStatus(
		    @Param("startDate") LocalDateTime startDate,
		    @Param("endDate") LocalDateTime endDate,
		    @Param("statuses") List<String> statuses
		);


	// total amout category 7 day
	@Query("WITH CleanedOrders AS ("
			+ "SELECT DISTINCT o.orderId AS orderId, cp.categoryProductId AS categoryProductId, "
			+ "cp.name AS name, cp.image AS image, o.amount AS amount " + "    FROM Order o "
			+ "JOIN o.orderDetails od " 
			+ "JOIN od.productDetailSize pds "
			+ "JOIN pds.productDetail pd "
			+ "JOIN pd.product p "
			+ "JOIN p.categoryProduct cp "
			+ "WHERE o.date BETWEEN :startDate AND :endDate AND o.status IN :statuses" + ") "
			+ "SELECT co.categoryProductId, co.name, co.image, SUM(co.amount) AS totalAmount "
			+ "FROM CleanedOrders co "
			+ "GROUP BY co.categoryProductId, co.name, co.image")
	List<Object[]> findCategoryProductTotalsLast7DaysWithStatus(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, @Param("statuses") List<String> statuses);

	// total amount category for a specific day
	@Query("WITH CleanedOrders AS ("
			+ "SELECT DISTINCT o.orderId AS orderId, cp.categoryProductId AS categoryProductId, "
			+ "cp.name AS name, cp.image AS image, o.amount AS amount "
			+ "FROM Order o "
			+ "JOIN o.orderDetails od "
			+ "JOIN od.productDetailSize pds " + "JOIN pds.productDetail pd "
			+ "JOIN pd.product p "
			+ "JOIN p.categoryProduct cp "
			+ "WHERE o.date BETWEEN :startOfDay AND :endOfDay AND o.status IN :statuses" + ") "
			+ "SELECT co.categoryProductId, co.name, co.image, SUM(co.amount) AS totalAmount "
			+ "FROM CleanedOrders co " + "GROUP BY co.categoryProductId, co.name, co.image")
	List<Object[]> findCategoryProductTotalsByDateAndStatus(@Param("startOfDay") LocalDateTime startOfDay,
			@Param("endOfDay") LocalDateTime endOfDay, @Param("statuses") List<String> statuses);

	// Total amount category between two dates with cleaned data
	@Query("WITH CleanedOrders AS ("
			+ "SELECT DISTINCT o.orderId AS orderId, cp.categoryProductId AS categoryProductId, "
			+ "cp.name AS name, cp.image AS image, o.amount AS amount " 
			+ "FROM Order o "
			+ "JOIN o.orderDetails od "
			+ "JOIN od.productDetailSize pds " 
			+ "JOIN pds.productDetail pd "
			+ "JOIN pd.product p " 
			+ "JOIN p.categoryProduct cp "
			+ "WHERE o.date BETWEEN :startDate AND :endDate AND o.status IN :statuses" + ") "
			+ "SELECT co.categoryProductId, co.name, co.image, SUM(co.amount) AS totalAmount "
			+ "FROM CleanedOrders co " + "GROUP BY co.categoryProductId, co.name, co.image")
	List<Object[]> findCategoryProductTotalsByBetweenAndStatus(@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, @Param("statuses") List<String> statuses);
	
	@Query("SELECT o FROM Order o " +
		       "JOIN o.orderDetails od " +
		       "JOIN od.productDetailSize pds " +
		       "JOIN pds.productDetail pd " +
		       "JOIN pd.product p " +
		       "WHERE p.productId = ?1")
		List<Order> findByProductId(Integer id);


}
