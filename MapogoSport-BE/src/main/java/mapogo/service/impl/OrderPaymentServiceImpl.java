package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderPaymentDAO;
import mapogo.entity.OrderPayment;
import mapogo.service.OrderPaymentService;

@Service
public class OrderPaymentServiceImpl implements OrderPaymentService {

	@Autowired
	OrderPaymentDAO orderPaymentDAO;
	
	@Override
	public OrderPayment create(OrderPayment orderPayment) {
		return orderPaymentDAO.save(orderPayment);
	}
	

}
