package mapogo.service;


import java.util.List;
import java.util.Map;

import mapogo.entity.User;
import mapogo.entity.UserSubscription;

public interface UserService {
	
	User findByUsername(String username);

	List<User> findAll();

	User createUser(User u);
	
	void updateUser(User u);
	
	User findByEmail(String email);
	
	UserSubscription saveUserSubcription(Map<String, Object> data);
	
	UserSubscription findUserSubscriptionByUser(String username);
	
	UserSubscription updateUserSubscription(Map<String, Object> data);
}
