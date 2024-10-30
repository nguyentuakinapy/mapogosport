package mapogo.service;

import java.util.List;

import mapogo.entity.Order;

public interface OrderService {
	List<Order> findByUser_Username(String username);
	//của Mỵ từ đây
	Order createOrder(Order order);
	//đến đây
}
