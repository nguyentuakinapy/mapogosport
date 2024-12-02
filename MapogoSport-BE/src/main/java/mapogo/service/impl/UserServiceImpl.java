package mapogo.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import mapogo.dao.AccountPackageDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.TransactionDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Notification;
import mapogo.entity.Transaction;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;
import mapogo.entity.UserVoucher;
import mapogo.entity.Wallet;
import mapogo.service.UserService;
import mapogo.service.WalletService;
import mapogo.utils.CloudinaryUtils;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	UserDAO userDAO;

	@Autowired
	AccountPackageDAO accountPackageDAO;

	@Autowired
	UserSubscriptionDAO userSubscriptionDAO;

	@Autowired
	NotificationDAO notificationDAO;

	@Autowired
	TransactionDAO transactionDAO;

	@Autowired
	CloudinaryUtils cloudinaryUtils;

	@Autowired
	SimpMessagingTemplate messagingTemplate;

	@Autowired
	WalletDAO walletDAO;

	@Override
	public User findByUsername(String username) {
		try {
			messagingTemplate.convertAndSend("/topic/login", userDAO.findById(username).get().getUsername());
			return userDAO.findById(username).get();
		} catch (Exception e) {
			return null;
		}

	}

	@Override
	public List<User> findAll() {
		return userDAO.findAll();
	}

	@Override
	public User createUser(User u) {
		User user = userDAO.save(u);
		Wallet w = new Wallet();
		w.setUser(u);
		w.setBalance(BigDecimal.valueOf(0));
		walletDAO.save(w);
		return user;
	}

	@Override
	public void updateUser(User u) {
		if (u.getUserVouchers() != null) {
			for (UserVoucher userVoucher : u.getUserVouchers()) {
				userVoucher.setUser(u);
			}
		}
		userDAO.save(u);
	}

	@Override
	public User findByEmail(String email) {
		return userDAO.findByEmail(email);
	}

	@Override
	public UserSubscription saveUserSubcription(Map<String, Object> data) {
		UserSubscription uS = new UserSubscription();

		AccountPackage ap = accountPackageDAO.findById((Integer) data.get("accountPackageId")).get();
		User u = userDAO.findById((String) data.get("username")).get();
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

		uS.setAccountPackage(ap);
		uS.setUser(u);

		try {
			uS.setStartDay(dateFormat.parse((String) data.get("startDay")));
			uS.setEndDay(dateFormat.parse((String) data.get("endDay")));
		} catch (ParseException e) {
			e.printStackTrace();
		}

		uS.setStatus((String) data.get("status"));
		userSubscriptionDAO.save(uS);
		Notification n = new Notification();
		n.setUser(u);
		n.setTitle("Đăng ký gói tài khoản");
		n.setMessage(ap.getPackageName() + " đã đăng ký thành công!");
		n.setType("info");

		notificationDAO.save(n);

		messagingTemplate.convertAndSend("/topic/username", u.getUsername());

		return uS;
	}

	@Override
	public UserSubscription findUserSubscriptionByUser(String username) {
		return userSubscriptionDAO.findByUsername(username);
	}

	@Override
	public UserSubscription updateUserSubscription(int accountPackageId, int userSubscriptionId) {
		UserSubscription uS = userSubscriptionDAO.findById(userSubscriptionId).get();
		AccountPackage ap = accountPackageDAO.findById(accountPackageId).get();
		uS.setAccountPackage(ap);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		
		LocalDate localDate = LocalDate.now();
        LocalDate newDate = localDate.plusDays(ap.getDurationDays());
		try {
			uS.setStartDay(formatter.parse(String.valueOf(localDate)));
			uS.setEndDay(formatter.parse(String.valueOf(newDate)));
		} catch (Exception e) {
			// TODO: handle exception
		}
		System.out.println("đã cập nhật");
		userSubscriptionDAO.save(uS);

		Notification n = new Notification();
		n.setUser(uS.getUser());
		n.setTitle("Nâng cấp gói tài khoản");
		n.setMessage(ap.getPackageName() + " đã nâng cấp thành công!");
		n.setType("info");

		notificationDAO.save(n);

		messagingTemplate.convertAndSend("/topic/username", uS.getUser().getUsername());

		return uS;
	}

	@Override
	public User findUserByBookingDetailId(Integer bookingDetailId) {
		return userDAO.findUserByBookingDetailId(bookingDetailId);
	}

	@Override
	public String uploadAvatar(String username, MultipartFile file) throws IOException {
		String avtUrl = cloudinaryUtils.uploadImage(file);
		User user = userDAO.findById(username).get();

		if (user.getAvatar() != null) {
			String oldAVT = user.getAvatar();
			cloudinaryUtils.deleteImage(oldAVT);
		}

		user.setAvatar(avtUrl);
		userDAO.save(user);

		return avtUrl;
	}

	@Override
	public List<Notification> findNotificationByUsername(String username) {
		User u = userDAO.findById(username).get();
		List<Notification> notifications = u.getNotifications();
		notifications.forEach(item -> {
			if (item.getBooking() != null) {
				item.setBookingId(item.getBooking().getBookingId());
			}
			if (item.getOrder() != null) {
				item.setOrderId(item.getOrder().getOrderId());
			}
			if (item.getUser() != null) {
				item.setUsername(item.getUser().getUsername());
			}
		});
		return notifications;
	}

	@Override
	public List<Notification> findByUser_UsernameContainingAndTypeContaining(String username, String type) {
		User user = userDAO.findById(username)
				.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
		List<Notification> filteredNotifications = user.getNotifications().stream()
				.filter(notification -> notification.getType() != null && notification.getType().contains(type))
				.toList();
		filteredNotifications.forEach(notification -> {
			if (notification.getUser() != null) {
				notification.setUsername(notification.getUser().getUsername()); // set thủ công username
			}
		});

		return filteredNotifications;
	}

	@Override
	public void setViewNotification(String username) {
		User u = userDAO.findById(username).get();
		u.getNotifications().forEach(item -> {
			item.setIsRead(true);
			notificationDAO.save(item);
		});

		messagingTemplate.convertAndSend("/topic/notification/isReadAll/username", u.getUsername());
	}

	@Override
	public void setViewNotificationTypeNotifyMess(String username) {
		User u = userDAO.findById(username).get();
		System.err.println("user name " + u.getUsername());
		u.getNotifications().forEach(item -> {
			if ("notifyMess".equals(item.getType())) {
				item.setIsRead(true);
				notificationDAO.save(item);
			}

		});
		messagingTemplate.convertAndSend("/topic/notification/isReadAll/username", u.getUsername());

	}

	@Override
	public void deleteNotification(String username) {
		notificationDAO.deleteByUsername(username);

		messagingTemplate.convertAndSend("/topic/notification/delete/username", username);
	}

	@Override
	public void deleteNotificationHaveTypeNotifyMess(String username) {
		notificationDAO.deleteByUsernameAndType(username, "notifyMess");

		messagingTemplate.convertAndSend("/topic/notification/delete/username", username);
	}

	@Override
	public void setIsReadNotification(Integer notificationId) {
		Notification n = notificationDAO.findById(notificationId).get();
		n.setIsRead(true);

		notificationDAO.save(n);

		messagingTemplate.convertAndSend("/topic/notification/isRead", n.getUser().getUsername());
	}

	@Override
	public UserSubscription updateUserSubcription(Integer id, Date endDate) {
		UserSubscription uS = userSubscriptionDAO.findById(id).get();
		uS.setEndDay(endDate);
		userSubscriptionDAO.save(uS);

		Wallet w = uS.getUser().getWallet();
		w.setBalance(w.getBalance().subtract(BigDecimal.valueOf(uS.getAccountPackage().getPrice())));
		walletDAO.save(w);

		Transaction transaction = new Transaction();
		transaction.setAmount(BigDecimal.valueOf(uS.getAccountPackage().getPrice()));
		transaction.setCreatedAt(LocalDateTime.now());
		transaction.setDescription("Gia hạn gói đăng ký!");
		transaction.setTransactionType('-' + String.valueOf(uS.getAccountPackage().getPrice()));
		transaction.setWallet(w);
		transactionDAO.save(transaction);
		
		Notification n = new Notification();
		n.setUser(uS.getUser());
		n.setTitle("Gia hạn gói tài khoản");
		n.setMessage(uS.getAccountPackage().getPackageName() + " đã gia hạn thành công!");
		n.setType("userSub");
		// Lưu và gửi thông báo
		notificationDAO.save(n);

		messagingTemplate.convertAndSend("/topic/notification/username",
				uS.getUser().getUsername());
		return uS;
	}

}
