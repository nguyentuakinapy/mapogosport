package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderDAO;
import mapogo.dto.OrderDTO;
import mapogo.entity.Order;
import mapogo.entity.PaymentMethod;
import mapogo.entity.User;
import mapogo.service.OrderService;
import mapogo.service.PaymentMethodService;
import mapogo.service.UserService;

@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderDAO orderDAO;
	
	@Override
	public List<Order> findByUser_Username(String username) {
		return orderDAO.findByUser_Username(username);
	}
//Myj
	@Autowired
	UserService userService;
	@Autowired
	PaymentMethodService paymentService;
	
	@Override
	public Order createOrder(OrderDTO orderDTO) {
		Order order = new Order();
		User user = userService.findByUsername(orderDTO.getUsername());
		order.setUser(user);
		order.setAddress(orderDTO.getAddress());
		order.setPhoneNumber(orderDTO.getPhoneNumber());
		order.setDate(orderDTO.getDate());
		order.setStatus(orderDTO.getStatus());
		order.setAmount(orderDTO.getAmount());
		PaymentMethod payment = paymentService.findByName(orderDTO.getPaymentMethod());
		order.setPaymentMethod(payment);
		order.setNote(orderDTO.getNote());
//		order.setVoucher();
		order.setShipFee(orderDTO.getShipFee());

		return orderDAO.save(order);
	}

	@Override
	public Order findByOrderId(int orderId) {
		return orderDAO.findById(orderId).get();
	}

	@Override
	public Order update(Order order) {
		return orderDAO.save(order);
	}

}
