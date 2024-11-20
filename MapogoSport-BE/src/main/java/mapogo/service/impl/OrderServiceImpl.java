package mapogo.service.impl;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.AuthorityDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.OrderDAO;
import mapogo.dao.ProductDetailSizeDAO;
import mapogo.dao.RoleDAO;
import mapogo.dto.OrderDTO;
import mapogo.entity.Authority;
import mapogo.entity.Notification;
import mapogo.entity.Order;
import mapogo.entity.OrderDetail;
import mapogo.entity.PaymentMethod;
import mapogo.entity.PhoneNumberUser;
import mapogo.entity.ProductDetailSize;
import mapogo.entity.Role;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.entity.Wallet;
import mapogo.service.OrderDetailService;
import mapogo.service.OrderService;
import mapogo.service.PaymentMethodService;
import mapogo.service.ProductDetailSizeService;
import mapogo.service.TransactionService;
import mapogo.service.UserService;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;
import mapogo.service.WalletService;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	OrderDAO orderDAO;

	List<String> statuses = Arrays.asList("Đã hoàn thành", "Đã thanh toán");

	Locale vietnam = new Locale("vi", "VN");
	NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(vietnam);

	@Override
	public List<Map<String, Object>> findOrderByUsername(String username) {
		List<Order> orders = orderDAO.findByUser_Username(username);
		List<Map<String, Object>> resultList = new ArrayList<>();

		for (Order order : orders) {
			Map<String, Object> orderData = new HashMap<>();
			orderData.put("orderId", order.getOrderId());
			for (OrderDetail orderDetail : order.getOrderDetails()) {
				orderData.put("productName",
						orderDetail.getProductDetailSize().getProductDetail().getProduct().getName());
			}
			orderData.put("address", order.getAddress());
			orderData.put("date", order.getDate());
			orderData.put("status", order.getStatus());
			orderData.put("amount", order.getAmount());
			orderData.put("fullname", order.getUser().getFullname());
			orderData.put("phoneNumber", order.getPhoneNumber());
			resultList.add(orderData);
		}

		return resultList;
	}

	@Override
	public List<Map<String, Object>> findAllOrder() {
		List<Order> orders = orderDAO.findAll();
		List<Map<String, Object>> resultList = new ArrayList<>();

		for (Order order : orders) {
			Map<String, Object> orderData = new HashMap<>();
			orderData.put("orderId", order.getOrderId());
			orderData.put("fullname", order.getUser().getFullname());
			orderData.put("date", order.getDate());
			orderData.put("amount", order.getAmount());
			orderData.put("address", order.getAddress());
			orderData.put("status", order.getStatus());
			orderData.put("phoneNumber", order.getPhoneNumber());
			resultList.add(orderData);
		}
		return resultList;
	}

	@Override
	public Order updateStatusOrder(Map<String, Object> orderData) {
		Integer orderId = (Integer) orderData.get("orderId");
		String newStatus = (String) orderData.get("status");

		Optional<Order> optionalOrder = orderDAO.findById(orderId);
		if (optionalOrder.isPresent()) {
			Order order = optionalOrder.get();
			order.setStatus(newStatus);
			orderDAO.save(order);
		}
		return null;
	}

	@Autowired
	UserService userService;
	@Autowired
	PaymentMethodService paymentService;
	@Autowired
	VoucherService voucherService;
	@Autowired
	UserVoucherService userVoucherService;
	@Autowired
	AuthorityDAO authorityDAO;
	@Autowired
	RoleDAO roleDAO;
	@Autowired
	NotificationDAO notificationDAO;
	@Autowired
	SimpMessagingTemplate messagingTemplate;

	@Autowired
	OrderDetailService orderDetailService;

	@Autowired
	WalletService walletService;

	@Override
	public Order createOrder(OrderDTO orderDTO) {
		Order order = new Order();
		User user = userService.findByUsername(orderDTO.getUsername());
		order.setUser(user);
		order.setAddress(orderDTO.getAddress());
		order.setPhoneNumber(orderDTO.getPhoneNumber());
		order.setDate(orderDTO.getDate());
		order.setStatus(orderDTO.getStatus());
		order.setAmount(orderDTO.getAmount());
		PaymentMethod payment = paymentService.findByName(orderDTO.getPaymentMethod());
		order.setPaymentMethod(payment);

		if (orderDTO.getVoucherId() != null) {
			Voucher voucher = voucherService.findById(orderDTO.getVoucherId());
			order.setVoucher(voucher);
			UserVoucher userVoucher = userVoucherService.findByUser_UsernameAndVoucher_VoucherId(orderDTO.getUsername(),
					orderDTO.getVoucherId());
			userVoucher.setStatus("Used");
			userVoucherService.update(userVoucher);
		}

		order.setShipFee(orderDTO.getShipFee());
		orderDAO.save(order);

		Role r = roleDAO.findById(2).get();
		r.getAuthorities().forEach(item -> {
			Notification n = new Notification();
			n.setOrder(order);
			n.setTitle("Bạn vừa có đơn hàng mới!");
			n.setMessage(user.getFullname() + " đã mua sản phẩm mới giá: " + currencyFormat.format(order.getAmount()));
			n.setType("info");
			n.setUser(item.getUser());
			notificationDAO.save(n);

			messagingTemplate.convertAndSend("/topic/order/new", item.getUser().getUsername());
		});

		return order;
	}

	@Override
	public Order findByOrderId(int orderId) {
		return orderDAO.findById(orderId).get();
	}

	@Override
	public Order update(Order order) {
		return orderDAO.save(order);
	}

	public List<Order> getOrdersToday() {
		return orderDAO.findOrdersToday();
	}

	@Override
	public List<Order> getOrdersLast7Days() {
		LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(6);
		return orderDAO.findOrdersLast7Days(sevenDaysAgo, statuses);
	}

	@Override
	public List<Order> getOrdersLastMonth() {
		LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
		return orderDAO.findOrdersLastMonth(oneMonthAgo, statuses);
	}

//	@Override
//	public List<Order> getOrdersBetweenDates(LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate) {
//		return orderDAO.findOrdersBetweenDates(date,startDate, endDate);
//	}
	@Override
	public List<Object[]> getCategoryProductTotalsToDay() {
		return orderDAO.findCategoryProductTotalsTodayWithStatus(statuses);
	}

	@Override
	public List<Object[]> getCategoryProductTotalsYesterday() {
		LocalDateTime startDate = LocalDate.now().minusDays(1).atStartOfDay(); // Start of yesterday
		LocalDateTime endDate = startDate.plusDays(1); // Start of today (exclusive end)
		return orderDAO.findCategoryProductTotalsYesterdayWithStatus(startDate, endDate, statuses);
	}

	@Override
	public List<Order> getOrdersYesterday() {
		LocalDateTime startOfYesterday = LocalDateTime.now().minusDays(1).toLocalDate().atStartOfDay();
		LocalDateTime endOfYesterday = startOfYesterday.plusDays(1).minusNanos(1);
		// Truyền thêm tham số `statuses` vào phương thức `findByDateBetweenAndStatus`
		return orderDAO.findByDateBetweenAndStatus(startOfYesterday, endOfYesterday, statuses);
	}

	@Override
	public List<Object[]> getCategoryProductTotals7Day() {
		LocalDateTime startDate = LocalDateTime.now().minusDays(7);
		return orderDAO.findCategoryProductTotalsLast7DaysWithStatus(startDate, statuses);
	}

	@Override
	public List<Object[]> getCategoryProductTotalsOneMonth() {
		LocalDateTime startDate = LocalDateTime.now().minusDays(30);
		return orderDAO.findCategoryProductTotalsLast7DaysWithStatus(startDate, statuses);
	}

	public Order createOrder(Order order) {
		return orderDAO.save(order);

	}

	public List<Order> getOrdersBetweenDates(LocalDateTime startDay, LocalDateTime endDay) {
		LocalDateTime adjustedEndDay = endDay.withHour(23).withMinute(59).withSecond(59);

		System.out.println("Start Day: " + startDay);
		System.out.println("Adjusted End Day: " + adjustedEndDay);
		return orderDAO.getOrdersBetweenDates(startDay, adjustedEndDay, statuses);
	}

	@Override
	public List<Order> getOrdersForSingleDate(LocalDateTime date) {
		// Adjusting start and end of day for the given date
		LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
		LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
		// Fetching orders for the entire day
		return orderDAO.getOrdersForSingleDate(startOfDay, endOfDay, statuses);
	}

	@Override
	public List<Object> findCategoryProductTotalsByDateAndStatus(LocalDateTime date) {
		LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
		LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
		return orderDAO.findCategoryProductTotalsByDateAndStatus(startOfDay, endOfDay, statuses);
	}

	@Override
	public List<Object> findCategoryProductTotalsByBetweenDateAndStatus(LocalDateTime startDate,
			LocalDateTime endDate) {
		LocalDateTime adjustedEndDay = endDate.withHour(23).withMinute(59).withSecond(59);
		return orderDAO.findCategoryProductTotalsByBetweenAndStatus(startDate, adjustedEndDay, statuses);
	}

	@Override
	public void delete(Order order) {
		notificationDAO.delete(notificationDAO.findByOrder(order));
		orderDAO.delete(order);
	}

	@Autowired
	ProductDetailSizeDAO productDetailSizeDAO;

	@Autowired
	TransactionService transactionService;

	@Override
	public Order cancelOrder(Map<String, Object> orderData) {
		System.out.println(orderData.get("orderId"));
		Integer orderId = Integer.parseInt((String) orderData.get("orderId"));
		String newStatus = (String) orderData.get("status");
		String reason = (String) orderData.get("reason");

		Optional<Order> optionalOrder = orderDAO.findById(orderId);
		if (optionalOrder.isPresent()) {
			Order order = optionalOrder.get();
			order.setStatus(newStatus);
			order.setNote(reason);
			orderDAO.save(order);

			// wallet
			if (!order.getPaymentMethod().getName().equals("COD")) {
				Wallet wallet = walletService.findByUsername(order.getUser());
				wallet.setBalance(wallet.getBalance().add(BigDecimal.valueOf(order.getAmount())));

				Transaction transaction = new Transaction();
				transaction.setWallet(wallet);
				transaction.setAmount(new BigDecimal(order.getAmount()));
				transaction.setCreatedAt(LocalDateTime.now());
				transaction.setDescription("Hoàn trả từ hóa đơn: " + orderId);
				transaction.setTransactionType("+" + order.getAmount());
				transactionService.create(transaction);
			}

		}

		// list productDetailSize
		List<OrderDetail> orderDetails = orderDetailService.findOrderDetailByOrderId(orderId);
		for (OrderDetail orderDetail : orderDetails) {
			ProductDetailSize productDetailSize = orderDetail.getProductDetailSize();
			productDetailSize.setQuantity(productDetailSize.getQuantity() + orderDetail.getQuantity());
			productDetailSizeDAO.save(productDetailSize);
		}

		Role r = roleDAO.findById(2).get();
		r.getAuthorities().forEach(item -> {
			Notification n = new Notification();
			n.setOrder(optionalOrder.get());
			n.setTitle("Có đơn hàng vừa hủy!");
			n.setMessage(optionalOrder.get().getUser().getFullname() + " đã hủy đơn hàng giá: "
					+ currencyFormat.format(optionalOrder.get().getAmount()));
			n.setType("info");
			n.setUser(item.getUser());
			notificationDAO.save(n);

			messagingTemplate.convertAndSend("/topic/order/cancel", item.getUser().getUsername());
		});

		return null;
	}
}
