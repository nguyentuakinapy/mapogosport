package mapogo.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.OrderDetail;
import mapogo.service.OrderDetailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class OrderDetailRestController {
	@Autowired
	OrderDetailService orderDetailService;
	
//	@GetMapping("/admin/order-detail-by-order/{orderId}")
//	public OrderDetail getOrderdetailByOrderId(@PathVariable("orderId") Integer orderId) {
//		return (OrderDetail) orderDetailService.findByOrder_OrderId(orderId);
//	}
	
}
