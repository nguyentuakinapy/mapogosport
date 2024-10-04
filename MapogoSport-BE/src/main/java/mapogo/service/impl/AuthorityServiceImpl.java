package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AuthorityDAO;
import mapogo.entity.Authority;
import mapogo.service.AuthorityService;

@Service
public class AuthorityServiceImpl implements AuthorityService{
	
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
}
