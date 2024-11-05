package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderDetailDAO;
import mapogo.entity.OrderDetail;
import mapogo.service.OrderDetailService;

@Service
public class OrderDetailServiceImpl implements OrderDetailService{
	@Autowired
	OrderDetailDAO orderDetailDAO;
	
	@Override
	public List<OrderDetail> findOrderDetailByOrderId(Integer orderId) {
		return orderDetailDAO.findByOrder_OrderId(orderId);
	}

}
