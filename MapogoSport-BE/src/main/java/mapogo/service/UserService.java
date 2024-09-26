package mapogo.service;

import mapogo.entity.User;

public interface UserService {
	User findByUsername(String username);
}
