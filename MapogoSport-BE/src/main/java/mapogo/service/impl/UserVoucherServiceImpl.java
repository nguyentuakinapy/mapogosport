package mapogo.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	public List<Map<String, Object>> findByUser(String username) {
		List<UserVoucher> userVouchers = userVoucherDao.findByUser_Username(username);
		List<Map<String, Object>> resultList = new ArrayList<>();
		
		for (UserVoucher userVoucher: userVouchers) {
			Map<String, Object> userVoucherData = new HashMap<>();
	        userVoucherData.put("userVoucherId", userVoucher.getUserVoucherId());
	        userVoucherData.put("status", userVoucher.getStatus());
	        userVoucherData.put("date", userVoucher.getDate());
	        
			Map<String, Object> voucherData = new HashMap<>();
			voucherData.put("voucherId", userVoucher.getVoucher().getVoucherId());
			voucherData.put("name", userVoucher.getVoucher().getName());
			voucherData.put("endDate", userVoucher.getVoucher().getEndDate());
			voucherData.put("status", userVoucher.getVoucher().getStatus());
			
			userVoucherData.put("voucher", voucherData);
			resultList.add(userVoucherData);
		}
		return resultList;
	}
	
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
	public UserVoucher update(UserVoucher userVoucher) {
		return userVoucherDao.save(userVoucher);
	}

	@Override
	public List<UserVoucher> findByUsername(String username) {
		return userVoucherDao.findByUser_Username(username);
	}

	@Override
	public UserVoucher findByUser_UsernameAndVoucher_VoucherId(String username, Integer voucherId) {
		return userVoucherDao.findByUser_UsernameAndVoucher_VoucherId(username, voucherId);
	}

	//đến đây
}
