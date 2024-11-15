package mapogo.service;

import java.util.List;

import mapogo.entity.OrderDetail;

public interface OrderDetailService {
	List<OrderDetail> findOrderDetailByOrderId(Integer orderId); //Mỵ có sài ké
	
	//của Mỵ từ đây
	OrderDetail create(OrderDetail orderDetail);
	void delete(OrderDetail orderDetail);
	//đến đây
}
