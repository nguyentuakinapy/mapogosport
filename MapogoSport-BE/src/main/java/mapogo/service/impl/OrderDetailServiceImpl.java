package mapogo.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OrderDetailDAO;
import mapogo.entity.Order;
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

	//của Mỵ từ đây
	@Override
	public OrderDetail create(OrderDetail orderDetail) {
		return orderDetailDAO.save(orderDetail);
	}

	@Override
	public void delete(OrderDetail orderDetail) {
		orderDetailDAO.delete(orderDetail);		
	}
	//đến đây

	@Override
	public Map<String, Object> findOrderDetailById(Integer orderId) {
	    List<OrderDetail> orderDetails = orderDetailDAO.findByOrder_OrderId(orderId);
	    Map<String, Object> resultMap = new HashMap<>();
	    
        Order order = orderDetails.get(0).getOrder();
        resultMap.put("fullname", order.getUser().getFullname());
        resultMap.put("address", order.getAddress());
        resultMap.put("phoneNumber", order.getPhoneNumber());
        resultMap.put("status", order.getStatus());

	    List<Map<String, Object>> orderDetailList = new ArrayList<>();
	    for (OrderDetail orderDetail : orderDetails) {
	        Map<String, Object> orderDetailData = new HashMap<>();
	        orderDetailData.put("orderDetailId", orderDetail.getOrderDetailId());
	        orderDetailData.put("productImage", orderDetail.getProductDetailSize().getProductDetail().getImage());
	        orderDetailData.put("productName", orderDetail.getProductDetailSize().getProductDetail().getProduct().getName());
	        orderDetailData.put("productColor", orderDetail.getProductDetailSize().getProductDetail().getColor());
	        orderDetailData.put("productPrice", orderDetail.getProductDetailSize().getPrice());
	        orderDetailData.put("quantity", orderDetail.getQuantity());
	        orderDetailList.add(orderDetailData);
	    }

	    resultMap.put("orderDetails", orderDetailList);

	    return resultMap;
	}

}
