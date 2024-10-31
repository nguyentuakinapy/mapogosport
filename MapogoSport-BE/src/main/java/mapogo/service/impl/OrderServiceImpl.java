package mapogo.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderDAO;
import mapogo.entity.Order;
import mapogo.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	OrderDAO orderDAO;

	List<String> statuses = Arrays.asList("Đã Giao hàng", "Đã Thanh Toán");

	@Override
	public List<Order> findByUser_Username(String username) {
		return orderDAO.findByUser_Username(username);
	}

	@Override
	public List<Order> getOrdersToday() {
		return orderDAO.findOrdersToday();
	}

	@Override
	public List<Order> getOrdersLast7Days() {
		LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6);
		return orderDAO.findOrdersLast7Days(sevenDaysAgo, statuses);
	}

	@Override
	public List<Order> getOrdersLastMonth() {
		LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
		return orderDAO.findOrdersLastMonth(oneMonthAgo, statuses);
	}

	@Override
	public List<Order> getOrdersBetweenDates(LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate) {
		return orderDAO.findOrdersBetweenDates(date,startDate, endDate);
	}

	@Override
	public List<Object[]> getCategoryProductTotalsToDay() {
		return orderDAO.findCategoryProductTotalsTodayWithStatus(statuses);
	}

	@Override
	public List<Order> getOrdersYesterday() {
		LocalDateTime startOfYesterday = LocalDateTime.now().minusDays(1).toLocalDate().atStartOfDay();
		LocalDateTime endOfYesterday = startOfYesterday.plusDays(1).minusNanos(1);
		// Truyền thêm tham số `statuses` vào phương thức `findByDateBetweenAndStatus`
		return orderDAO.findByDateBetweenAndStatus(startOfYesterday, endOfYesterday, statuses);
	}

	@Override
	public List<Object[]> getCategoryProductTotals7Day() {
		LocalDateTime startDate = LocalDateTime.now().minusDays(7);
		return orderDAO.findCategoryProductTotalsLast7DaysWithStatus(startDate, statuses);
	}

	@Override
	public List<Object[]> getCategoryProductTotalsOneMonth() {
		LocalDateTime startDate = LocalDateTime.now().minusDays(30);
		return orderDAO.findCategoryProductTotalsLast7DaysWithStatus(startDate, statuses);
	}

}
