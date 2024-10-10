package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.UserDAO;
import mapogo.entity.User;
import mapogo.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	@Autowired
	UserDAO userDAO;

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
		userDAO.save(u);
	}

	@Override
	public User findByEmail(String email) {
		return userDAO.findByEmail(email);
	}

}
