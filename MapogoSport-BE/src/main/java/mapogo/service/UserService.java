package mapogo.service;

import java.util.List;

import mapogo.entity.User;

public interface UserService {
	
	User findByUsername(String username);

	List<User> findAll();

}
