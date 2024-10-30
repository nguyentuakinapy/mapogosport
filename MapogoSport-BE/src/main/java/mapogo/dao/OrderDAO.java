package mapogo.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mapogo.entity.CategoryProduct;
import mapogo.entity.Order;

public interface OrderDAO extends JpaRepository<Order, Integer>{
	List<Order> findByUser_Username(String username);
	
	
	// 1. Lọc theo ngày hôm nay
    @Query("SELECT o FROM Order o WHERE o.date = CURRENT_DATE")
    List<Order> findOrdersToday();

    // 2. Lọc theo 7 ngày gần đây
    @Query("SELECT o FROM Order o WHERE o.date BETWEEN :sevenDaysAgo AND CURRENT_DATE")
    List<Order> findOrdersLast7Days(@Param("sevenDaysAgo") LocalDate sevenDaysAgo);

    // 3. Lọc theo 1 tháng gần đây
    @Query("SELECT o FROM Order o WHERE o.date BETWEEN :oneMonthAgo AND CURRENT_DATE")
    List<Order> findOrdersLastMonth(@Param("oneMonthAgo") LocalDate oneMonthAgo);

    // 4. Lọc theo khoảng ngày tùy chọn
    @Query("SELECT o FROM Order o WHERE o.date BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    
    //total amout category to day 
    @Query("SELECT "
            + "cp.categoryProductId, "
            + "cp.name, "
            + "cp.image, "
            + "SUM(o.amount) "
            + "FROM CategoryProduct cp "
            + "JOIN cp.products p "
            + "JOIN p.productDetails pd "
            + "JOIN pd.productDetailSizes pds "
            + "JOIN pds.orderDetails od "
            + "JOIN od.order o "
            + "WHERE o.date = CURRENT_DATE "
            + "GROUP BY "
            + "cp.categoryProductId, "
            + "cp.name, "
            + "cp.image")

    List<Object[]> findCategoryProductTotalsToDay();





}
