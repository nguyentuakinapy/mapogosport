package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mapogo.dao.VoucherDAO;
import mapogo.entity.Voucher;
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
	@Override
	public Voucher findById(int id) {
		return dao.findById(id).get();
	}
	//đến đây
}
