package mapogo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import mapogo.entity.Order;

public interface OrderService {
	List<Order> findByUser_Username(String username);
	List<Order> getOrdersToday();
	List<Order> getOrdersYesterday();
	List<Order> getOrdersLast7Days();
	List<Order> getOrdersLastMonth();
	List<Order> getOrdersBetweenDates( LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate);
	List<Object[]> getCategoryProductTotalsToDay();
	List<Object[]> getCategoryProductTotals7Day();
	List<Object[]> getCategoryProductTotalsOneMonth();
}
