package mapogo.service;


import java.util.List;

import mapogo.entity.User;

public interface UserService {
	
	User findByUsername(String username);

	List<User> findAll();

	User createUser(User u);
	
	void updateUser(User u);
	
	User findByEmail(String email);
}
