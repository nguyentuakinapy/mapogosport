package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AuthorityDAO;
import mapogo.dao.RoleDAO;

import mapogo.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	RoleDAO roleDao;

	@Autowired
	AuthorityDAO authorityDAO;


}
