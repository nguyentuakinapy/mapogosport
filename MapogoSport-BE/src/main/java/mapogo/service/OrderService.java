package mapogo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import mapogo.dto.OrderDTO;
import mapogo.entity.Order;

public interface OrderService {
	List<Map<String, Object>> findOrderByUsername(String username);
	List<Map<String, Object>> findAllOrder();
	Order updateStatusOrder(Map<String, Object> orderData);
	
	
	// của Mỵ từ đây
	Order createOrder(OrderDTO order);

	Order findByOrderId(int orderId);
	
//	List<Map<String, Object>> findOrderById(Integer orderId);

	Order update(Order order);
	
	void delete(Order order);
	//hủy đơn hàng
	Order cancelOrder(Map<String, Object> orderData);


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

	List<Object[]> findCategoryProductTotalsByDateAndStatus(LocalDateTime date);
	List<Object[]> findCategoryProductTotalsByBetweenDateAndStatus(LocalDateTime startDate, LocalDateTime endDate);
	
	List<Order> findOrderByProductId(Integer productId);
}
