package mapogo.service.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.OwnerDAO;
import mapogo.dao.UserDAO;
import mapogo.entity.Owner;
import mapogo.entity.User;
import mapogo.service.OwnerService;
@Service
public class OwnerServiceImpl implements OwnerService{

	@Autowired
	OwnerDAO dao;
	
	@Autowired
	UserDAO userDAO;
	
	@Override
	public Owner findOwnerByUsername(User useranme) {
		return dao.findByUser(useranme);
	}

	@Override
	public Owner findByUsername(String useranme) {
		return dao.findByUsername(useranme);
	}

	@Override
	public Owner save(Map<String, Object> owner) {
		Owner ow = new Owner();
		
		User u = userDAO.findById((String) owner.get("username")).get();
		
		ow.setUser(u);
		ow.setBankAccount((String) owner.get("bankAccount"));
		ow.setMomoAccount((String) owner.get("momoAccount"));
		ow.setVnpayAccount((String) owner.get("vnpayAccount"));
		return dao.save(ow);
	}

}
