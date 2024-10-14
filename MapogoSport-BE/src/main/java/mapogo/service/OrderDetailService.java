package mapogo.service;

import java.util.List;

import mapogo.entity.OrderDetail;

public interface OrderDetailService {
	List<OrderDetail> findByOrder_OrderId(Integer orderId);
}
