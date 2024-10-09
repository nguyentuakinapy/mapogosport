package mapogo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import mapogo.dao.VoucherDAO;
import mapogo.entity.Voucher;
import mapogo.service.VoucherService;
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

}
