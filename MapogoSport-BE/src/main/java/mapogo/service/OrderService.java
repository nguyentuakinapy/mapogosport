package mapogo.service;

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
}
