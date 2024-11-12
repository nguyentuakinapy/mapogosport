package mapogo.service;


import java.io.IOException;
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
	
	UserSubscription findUserSubscriptionByUser(String username);
	
	UserSubscription updateUserSubscription(Map<String, Object> data);
	
	User findUserByBookingDetailId(Integer bookingDetailId);
	
	List<Notification> findNotificationByUsername(String username);
}
