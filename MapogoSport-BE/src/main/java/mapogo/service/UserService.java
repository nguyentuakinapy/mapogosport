package mapogo.service;


import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import mapogo.entity.Notification;
import mapogo.entity.User;
import mapogo.entity.UserSubscription;

public interface UserService {
	
	User findByUsername(String username);
	
	String uploadAvatar(String username, MultipartFile file) throws IOException;

	List<User> findAll();

	User createUser(User u);
	
	void updateUser(User u);
	
	User findByEmail(String email);
	
	UserSubscription saveUserSubcription(Map<String, Object> data);
	
	UserSubscription updateUserSubcription(Integer id, Date endDate);
	
	UserSubscription findUserSubscriptionByUser(String username);
	
	UserSubscription updateUserSubscription(int accountPackageId, int userSubscriptionId);
	
	User findUserByBookingDetailId(Integer bookingDetailId);
	
	List<Notification> findNotificationByUsername(String username);
	
	List<Notification> findByUser_UsernameContainingAndTypeContaining(String username, String type);;
	
	void setViewNotification(String username);
	
	void setViewNotificationTypeNotifyMess(String username);
	
	void deleteNotification(String username);
	
	void deleteNotificationHaveTypeNotifyMess(String username);
	
	void setIsReadNotification(Integer notificationId);
}
