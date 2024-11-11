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

	@Override
	public boolean checkUserVoucher(String username, Integer voucherId) {
		return userVoucherDao.existsByUser_UsernameAndVoucher_VoucherId(username, voucherId);	
	}
	
	//của Mỵ từ đây
	@Override
	public UserVoucher findByUserVoucherId(int userVoucherId) {
		return userVoucherDao.findById(userVoucherId).get();
	}

	@Override
	public UserVoucher update(UserVoucher userVoucher) {
		return userVoucherDao.save(userVoucher);
	}
	//đến đây
}
