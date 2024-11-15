package mapogo.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import mapogo.dao.AuthorityDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.OrderDAO;
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
import mapogo.entity.User;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.OrderService;
import mapogo.service.PaymentMethodService;
import mapogo.service.UserService;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;

@Service
public class OrderServiceImpl implements OrderService {
	@Autowired
	OrderDAO orderDAO;

	List<String> statuses = Arrays.asList("Đã hoàn thành", "Đã Thanh Toán");

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
		
		if (orderDTO.getVoucherId()!=null) {
			Voucher voucher = voucherService.findById(orderDTO.getVoucherId());
			order.setVoucher(voucher);
			UserVoucher userVoucher = userVoucherService.findByUser_UsernameAndVoucher_VoucherId(orderDTO.getUsername(), orderDTO.getVoucherId());
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
			n.setMessage(user.getFullname() + " đã mua sản phẩm mới giá: " + order.getAmount());
			n.setType("info");
			n.setUser(item.getUser());
			notificationDAO.save(n);
			
			messagingTemplate.convertAndSend("/topic/username", item.getUser().getUsername());
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
		LocalDateTime startDate = LocalDate.now().minusDays(1).atStartOfDay(); // Bắt đầu từ 00:00 của ngày hôm qua
		LocalDateTime endDate = startDate.plusHours(23).plusMinutes(59).plusSeconds(59); // Kết thúc tại 23:59:59 của
																							// ngày hôm qua
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
        return orderDAO.getOrdersForSingleDate(startOfDay, endOfDay,statuses);
    }

    @Override
    public List<Object> findCategoryProductTotalsByDateAndStatus(LocalDateTime date) {
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
        return orderDAO.findCategoryProductTotalsByDateAndStatus(startOfDay, endOfDay, statuses);
    }

    @Override
    public List<Object> findCategoryProductTotalsByBetweenDateAndStatus(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime adjustedEndDay = endDate.withHour(23).withMinute(59).withSecond(59);
        return orderDAO.findCategoryProductTotalsByBetweenAndStatus(startDate, adjustedEndDay, statuses);
    }

	@Override
	public void delete(Order order) {
		orderDAO.delete(order);
	}

	@Override
	public List<Map<String, Object>> findOrderById(Integer orderId) {
		Order list = orderDAO.findById(orderId).get();
		
		List<Map<String, Object>> resultList = new ArrayList<>();
		
		Map<String, Object> orderMap = new HashMap<>();
		orderMap.put("orderId", list.getOrderId());
		orderMap.put("fullname", list.getUser().getFullname());
		orderMap.put("address", list.getAddress());
		orderMap.put("phoneNumber", list.getPhoneNumber());
		orderMap.put("date", list.getDate());
		orderMap.put("amount", list.getAmount());
		
		resultList.add(orderMap);
		return resultList;
	}


}
