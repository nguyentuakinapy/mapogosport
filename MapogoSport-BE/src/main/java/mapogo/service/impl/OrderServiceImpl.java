package mapogo.service.impl;

import java.time.LocalDate;
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
		LocalDate sevenDaysAgo = LocalDate.now().minusDays(6);
		return orderDAO.findOrdersLast7Days(sevenDaysAgo);
	}

	@Override
	public List<Order> getOrdersLastMonth() {
		LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
		return orderDAO.findOrdersLastMonth(oneMonthAgo);
	}

	@Override
	public List<Order> getOrdersBetweenDates(LocalDate startDate, LocalDate endDate) {
		return orderDAO.findOrdersBetweenDates(startDate, endDate);
	}

	@Override
	public List<Object[]> getCategoryProductTotalsToDay() {
		return orderDAO.findCategoryProductTotalsToDay();
    
	public Order createOrder(Order order) {
		return orderDAO.save(order);
	}

}
