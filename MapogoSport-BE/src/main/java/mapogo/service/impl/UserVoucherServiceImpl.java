package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.UserVoucherDAO;
import mapogo.entity.UserVoucher;
import mapogo.service.UserVoucherService;

@Service
public class UserVoucherServiceImpl implements UserVoucherService{

	@Autowired 
	UserVoucherDAO userVoucherDao;
	
	@Override
	public UserVoucher createUserVoucher(UserVoucher userVoucher) {
		// TODO Auto-generated method stub
		return userVoucherDao.save(userVoucher);
	}

	@Override
	public List<UserVoucher> findUserVoucher() {
		// TODO Auto-generated method stub
		return userVoucherDao.findAll();
	}
	
}
