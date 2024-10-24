package mapogo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OwnerDAO;
import mapogo.entity.Owner;
import mapogo.entity.User;
import mapogo.service.OwnerService;
@Service
public class OwnerServiceImpl implements OwnerService{

	@Autowired
	OwnerDAO dao;
	
	@Override
	public Owner findOwnerByUsername(User useranme) {
		return dao.findByUser(useranme);
	}

	@Override
	public Owner findByUsername(String useranme) {
		return dao.findByUsername(useranme);
	}

}
