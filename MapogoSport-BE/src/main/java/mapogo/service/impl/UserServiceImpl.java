package mapogo.service.impl;

import java.io.IOException;
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
import mapogo.entity.AccountPackage;
import mapogo.entity.Notification;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;
import mapogo.entity.UserVoucher;
import mapogo.service.UserService;
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

	@Override
	public User findByUsername(String username) {
		return userDAO.findById(username).get();
	}

	@Override
	public List<User> findAll() {
		return userDAO.findAll();
	}

	@Override
	public User createUser(User u) {
		return userDAO.save(u);
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
		return userSubscriptionDAO.save(uS);
	}

	@Override
	public UserSubscription findUserSubscriptionByUser(String username) {
		return userSubscriptionDAO.findByUsername(username);
	}

	@Override
	public UserSubscription updateUserSubscription(Map<String, Object> data) {
		UserSubscription uS = userSubscriptionDAO.findById((Integer) data.get("userSubscriptionId")).get();
		AccountPackage ap = accountPackageDAO.findById((Integer) data.get("accountPackageId")).get();
		uS.setAccountPackage(ap);
		return userSubscriptionDAO.save(uS);
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
