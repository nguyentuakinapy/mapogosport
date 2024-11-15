package mapogo.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AuthorityDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Authority;
import mapogo.entity.Role;
import mapogo.entity.User;
import mapogo.service.AuthorityService;
import mapogo.service.RoleService;
import mapogo.service.UserService;

@Service
public class AuthorityServiceImpl implements AuthorityService {

	@Autowired
	AuthorityDAO authorityDAO;

	@Override
	public Authority createAuthority(Authority auth) {
		return authorityDAO.save(auth);
	}

	@Override
	public List<Authority> findAll() {
		return authorityDAO.findAll();
	}


	@Override
	public void deleteByUser(User user) {
		authorityDAO.deleteByUser(user);
	}

}
