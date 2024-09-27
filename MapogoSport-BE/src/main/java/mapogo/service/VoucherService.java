package mapogo.service;

import java.util.List;

import mapogo.entity.Voucher;

public interface VoucherService {
	Voucher findByName(String name);
	List<Voucher> findByDiscountPercent(Integer discountPercent);
	
}
