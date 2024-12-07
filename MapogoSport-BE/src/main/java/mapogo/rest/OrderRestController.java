package mapogo.rest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import mapogo.dao.AuthorityDAO;
import mapogo.dto.OrderDTO;
import mapogo.entity.Authority;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.Wallet;
import mapogo.service.OrderDetailService;
import mapogo.service.OrderService;
import mapogo.service.TransactionService;
import mapogo.service.UserService;
import mapogo.service.WalletService;
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
	public List<Map<String, Object>> getUserAll(@PathVariable("username") String username) {
		return orderService.findOrderByUsername(username);
	}

	@GetMapping("/admin/order/findAll")
	public List<Map<String, Object>> getAdminAll() {
		return orderService.findAllOrder();
	}

	@PutMapping("/admin/order/update")
	public void updateOrderStatus(@RequestBody Map<String, Object> orderData) {
		orderService.updateStatusOrder(orderData);
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

	@GetMapping("/admin/category-product-totals-yesterday")
	public List<Object[]> getCategoryProductTotalsYesterday() {
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
	public List<Order> getOrdersBetween(@RequestParam(value = "date", required = false) LocalDateTime date,
			@RequestParam(value = "startDay", required = false) LocalDateTime startDay,
			@RequestParam(value = "endDay", required = false) LocalDateTime endDay) {

		// Log the received parameters for debugging
		System.out.println("Received date: " + date);
		System.out.println("Received startDay: " + startDay);
		System.out.println("Received endDay: " + endDay);

		if (date != null && startDay == null && endDay == null) {
			return orderService.getOrdersForSingleDate(date);
		} else if (startDay != null && endDay != null && date == null) {
			return orderService.getOrdersBetweenDates(startDay, endDay);
		} else {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date parameters");
		}
	}

	@GetMapping("/admin/category-product-total-between")
	public List<Object[]> getCategoryProductTotalBetween(
			@RequestParam(value = "date", required = false) LocalDateTime date,
			@RequestParam(value = "startDay", required = false) LocalDateTime startDay,
			@RequestParam(value = "endDay", required = false) LocalDateTime endDay) {
		if (date != null && startDay == null && endDay == null) {
			return orderService.findCategoryProductTotalsByDateAndStatus(date);
		} else if (startDay != null && endDay != null && date == null) {
			return orderService.findCategoryProductTotalsByBetweenDateAndStatus(startDay, endDay);
		} else {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date parameters");
		}
	}
	

	// của Mỵ từ đây
	@Autowired
	WalletService walletService;

	@Autowired
	UserService userService;

	@Autowired
	TransactionService transactionService;
	
	@Autowired
	AuthorityDAO authDAO;

	@PostMapping("/create_order")
	public ResponseEntity<Order> createOrder(@RequestBody OrderDTO orderDTO) {
		Order createdOrder = orderService.createOrder(orderDTO);
		if (orderDTO.getPaymentMethod().equals("Thanh toán ví")) {
			User user = userService.findByUsername(orderDTO.getUsername());
			Wallet wallet = walletService.findByUsername(user);
			wallet.setBalance(wallet.getBalance().subtract(BigDecimal.valueOf(orderDTO.getAmount())));

			Transaction transaction = new Transaction();
			transaction.setWallet(wallet);
			transaction.setAmount(new BigDecimal(orderDTO.getAmount()));
			transaction.setCreatedAt(LocalDateTime.now());
			transaction.setDescription("Thanh toán hóa đơn: " + createdOrder.getOrderId());
			transaction.setTransactionType("-" + createdOrder.getAmount());
			transactionService.create(transaction);
			
			//wallet admin
			walletService.addFundsToAdminWallet(BigDecimal.valueOf(createdOrder.getAmount()), "Từ hóa đơn: "+createdOrder.getOrderId());
		}

		return ResponseEntity.ok(createdOrder);
	}


	@PutMapping("/order/cancel")
	public void cancelOrder(@RequestBody Map<String, Object> orderData) {
		orderService.cancelOrder(orderData);
	}
	// đến đây

}
