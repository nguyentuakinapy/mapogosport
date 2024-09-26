package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;

import mapogo.dao.UserDAO;
import mapogo.entity.User;
import mapogo.service.UserService;

public class UserServiceImpl implements UserService{
	@Autowired
	UserDAO userDAO;

	@Override
	public User findByUsername(String username) {
		return userDAO.findById(username).get();
	}
}
