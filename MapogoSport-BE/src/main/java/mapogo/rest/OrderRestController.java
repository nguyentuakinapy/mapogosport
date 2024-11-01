package mapogo.rest;

import java.time.LocalDateTime;
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
import mapogo.service.impl.OrderServiceImpl;

import org.springframework.web.bind.annotation.RequestParam;

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

	@GetMapping("/admin/orderToDay")
	public List<Order> getOrderToDay() {
		return orderService.getOrdersToday();
	}

	@GetMapping("/admin/orderYesterday")
	public List<Order> getOrderYesterday() {
		return orderService.getOrdersYesterday();
	}

	@GetMapping("/admin/category-product-totals-today")
	public List<Object[]> getCategoryProductTotalsToDay() {
		return orderService.getCategoryProductTotalsToDay();
	}


	@GetMapping("/admin/category-product-totals-7day")
	public List<Object[]> getCategoryProductTotals7Day() {
		return orderService.getCategoryProductTotals7Day();
	}

	@GetMapping("/admin/category-product-totals-one-month")
	public List<Object[]> getCategoryProductTotalsOneMonnth() {
		return orderService.getCategoryProductTotalsOneMonth();
	}

	@GetMapping("/admin/order7day")
	public List<Order> getOrder7day() {
		return orderService.getOrdersLast7Days();
	}

	@GetMapping("/admin/orderOneMonth")
	public List<Order> getOrderOneMonth() {
		return orderService.getOrdersLastMonth();
	}

	@GetMapping("/admin/order-between")
	public List<Order> getOrdersBetween(
	        @RequestParam(value = "date", required = false) LocalDateTime date,
	        @RequestParam(value = "startDay", required = false) LocalDateTime startDay,
	        @RequestParam(value = "endDay", required = false) LocalDateTime endDay) {
	    return orderService.getOrdersBetweenDates(date, startDay, endDay);
	}



	

	//của Mỵ từ đây
	@PostMapping("/create_order")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }
	
	//đến đây

}
