package mapogo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import mapogo.dto.OrderDTO;
import mapogo.entity.Order;

public interface OrderService {
	List<Order> findOrderByUsername(String username);
	List<Map<String, Object>> findAllOrder();
	Order updateStatusOrder(Map<String, Object> orderData);
	
	//của Mỵ từ đây
	List<Order> findByUser_Username(String username);

	// của Mỵ từ đây
	Order createOrder(OrderDTO order);

	Order findByOrderId(int orderId);

	Order update(Order order);

	// đến đây

	List<Order> getOrdersYesterday();

	List<Order> getOrdersToday();

	List<Order> getOrdersLastMonth();

//	List<Order> getOrdersBetweenDates(LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate);
	List<Order> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

	List<Order> getOrdersForSingleDate(LocalDateTime date);

	List<Object[]> getCategoryProductTotalsToDay();

	List<Object[]> getCategoryProductTotals7Day();

	List<Object[]> getCategoryProductTotalsOneMonth();

	List<Order> getOrdersLast7Days();

	List<Object[]> getCategoryProductTotalsYesterday();

	List<Object> findCategoryProductTotalsByDateAndStatus(LocalDateTime date);
	List<Object> findCategoryProductTotalsByBetweenDateAndStatus(LocalDateTime startDate, LocalDateTime endDate);
}
