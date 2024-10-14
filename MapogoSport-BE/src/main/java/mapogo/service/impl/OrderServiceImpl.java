package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderDAO;
import mapogo.entity.Order;
import mapogo.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderDAO orderDAO;
	
	@Override
	public List<Order> findByUser_Username(String username) {
		return orderDAO.findByUser_Username(username);
	}

}
