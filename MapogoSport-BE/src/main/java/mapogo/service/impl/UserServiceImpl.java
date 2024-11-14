package mapogo.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import mapogo.dao.AccountPackageDAO;
import mapogo.dao.NotificationDAO;
import mapogo.dao.UserDAO;
import mapogo.dao.UserSubscriptionDAO;
import mapogo.dao.WalletDAO;
import mapogo.entity.AccountPackage;
import mapogo.entity.Notification;
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
		return notifications;
	}

	@Override
	public void setViewNotification(String username) {
		User u = userDAO.findById(username).get();
		u.getNotifications().forEach(item -> {
			item.setIsRead(true);
			notificationDAO.save(item);
		});

		messagingTemplate.convertAndSend("/topic/username", u.getUsername());
	}

	@Override
	public void deleteNotification(String username) {
		notificationDAO.deleteByUsername(username);

		messagingTemplate.convertAndSend("/topic/username", username);
	}

	@Override
	public void setIsReadNotification(Integer notificationId) {
		Notification n = notificationDAO.findById(notificationId).get();
		n.setIsRead(true);

		notificationDAO.save(n);

		messagingTemplate.convertAndSend("/topic/username", n.getUser().getUsername());
	}
}
