package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.AddressUserDAO;
import mapogo.entity.AddressUser;
import mapogo.service.AddressUserService;

@Service
public class AddressUserServiceImpl implements AddressUserService{
	@Autowired
	AddressUserDAO addressUserDAO;

	@Override
    public List<AddressUser> findByUsername(String username) {
        return addressUserDAO.findByUser_Username(username);
    }

}
