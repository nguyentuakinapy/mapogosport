package mapogo.service;

import java.time.LocalDate;
import java.util.List;

import mapogo.entity.Order;

public interface OrderService {
	List<Order> findByUser_Username(String username);
	List<Order> getOrdersToday();
	List<Order> getOrdersLast7Days();
	List<Order> getOrdersLastMonth();
	List<Order> getOrdersBetweenDates(LocalDate startDate, LocalDate endDate);
	List<Object[]> getCategoryProductTotalsToDay();
}
