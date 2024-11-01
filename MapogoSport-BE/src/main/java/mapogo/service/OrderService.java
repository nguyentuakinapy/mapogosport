package mapogo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import mapogo.dto.OrderDTO;
import mapogo.entity.Order;

public interface OrderService {
	List<Order> findByUser_Username(String username);
	//của Mỵ từ đây
	Order createOrder(OrderDTO order);
	Order findByOrderId(int orderId);
	Order update(Order order);

	//đến đây

	List<Order> getOrdersYesterday();

	List<Order> getOrdersToday();

	List<Order> getOrdersLastMonth();

	List<Order> getOrdersBetweenDates(LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate);

	List<Object[]> getCategoryProductTotalsToDay();

	List<Object[]> getCategoryProductTotals7Day();

	List<Object[]> getCategoryProductTotalsOneMonth();


	List<Order> getOrdersLast7Days();
}
