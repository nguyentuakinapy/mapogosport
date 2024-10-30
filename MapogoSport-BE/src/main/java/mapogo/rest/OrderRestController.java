package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.service.OrderDetailService;
import mapogo.service.OrderService;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class OrderRestController {
	@Autowired
	OrderService orderService;
	@Autowired
	OrderDetailService orderDetailService;
	
	@GetMapping("/user/order/{username}")
	public List<Order> getAll(@PathVariable("username") String username) {
		return orderService.findByUser_Username(username);
	}
	
	@GetMapping("/user/orders/detail/{orderId}")
	public List<OrderDetail> getOrderDetails(@PathVariable("orderId") Integer orderId) {
		return orderDetailService.findByOrder_OrderId(orderId);
	}
	
	//của Mỵ từ đây
	@PostMapping("/create_order")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }
	
	//đến đây
}
