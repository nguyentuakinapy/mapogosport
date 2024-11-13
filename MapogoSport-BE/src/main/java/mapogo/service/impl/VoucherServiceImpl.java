package mapogo.service.impl;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.VoucherDAO;
import mapogo.entity.UserVoucher;
import mapogo.entity.Voucher;
import mapogo.service.UserService;
import mapogo.service.UserVoucherService;
import mapogo.service.VoucherService;

@Service
public class VoucherServiceImpl implements VoucherService{

	@Autowired
	VoucherDAO dao;
	@Override
	public Voucher findByName(String name) {
		return dao.findByName(name);
	}

	@Override
	public List<Voucher> findByDiscountPercent(Integer discountPercent) {
		return dao.findByDiscountPercent(discountPercent);
	}

	@Override
	public List<Voucher> selectVoucherActive() {
		return dao.selectVoucherActive();
	}

	@Override
	public List<Voucher> finAll() {
		// TODO Auto-generated method stub
		return dao.findAll();
	}

	//của Mỵ từ đây
	@Autowired
	UserVoucherService userVoucherService;
	@Override
	public Voucher findById(int id) {
		return dao.findById(id).get();
	}

	@Override
	public List<Voucher> findByUserName(String username) {
		List<UserVoucher> userVouchers = userVoucherService.findByUsername(username);
		List<UserVoucher> unusedVouchers = userVouchers.stream()
			    .filter(voucher -> "Unused".equals(voucher.getStatus())) 
			    .collect(Collectors.toList());
		List<Voucher> vouchers =  new ArrayList<>();
		for (UserVoucher userVoucher : unusedVouchers) {
			Voucher voucher = userVoucher.getVoucher();
		    if (voucher.getEndDate().isAfter(LocalDateTime.now())) { 
		        vouchers.add(voucher); 
		    }		}
		return vouchers;
	}
	//đến đây
}
